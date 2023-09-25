import { Injectable } from "@nestjs/common";
import { OtpDto, PinDto } from "../otp/otp.dto";
import { InfoBipService } from "../sms-providers/info-bip/info-bip.service";
import { TwilioService } from "../sms-providers/twilio/twilio.service";

export interface ResponseType {
  success: boolean;
  errorMessage?: string;
  errorDetails?: {};
  status?: string;
  to?: string;
  smsStatus?: string;
}

enum SmsProviderType {
  Twilio = "Twilio",
  InfoBip = "InfoBip",
}

export enum ProviderServiceType {
  sendOTP = "sendOTP",
  verifyOTP = "verifyOTP",
}

@Injectable()
export class SmsService {
  private readonly prefferedProviders = new Map<string, string>();

  constructor(
    private readonly infoBipService: InfoBipService,
    private readonly twilioService: TwilioService
  ) {
    this.prefferedProviders.set("AU", "InfoBip");
    this.prefferedProviders.set("LK", "InfoBip");
    this.prefferedProviders.set("Other", "Twilio");
  }

  async sendOTPSms(otpData: OtpDto) {
    let countryCode = await this.verifyUserCountry(
      otpData.userDetails.phoneNumber
    );

    switch (countryCode) {
      case "0094":
        countryCode = "LK";
        break;
      case "0061":
        countryCode = "AU";
        break;
      default:
        countryCode = "Other";
    }

    const selectedProvider = await this.prefferedProviders.get(countryCode);

    if (!selectedProvider) {
      throw new Error(
        `No preffered provider found for country code ${countryCode}`
      );
    }

    try {
      const response = (await this.sendSmsUsingProvider(
        selectedProvider,
        otpData.userDetails.phoneNumber,
        otpData.messageBody
      )) as ResponseType;

      if (response.success) {
        return `SMS sent successfully using ${selectedProvider}: ${response.status} ${response.smsStatus}`;
      }
    } catch (error) {
      throw new Error(
        `Failed to send SMS using ${selectedProvider} - ${error.message}`
      );
    }
  }

  async verifyOTP(pinDto: PinDto) {
    return await this.infoBipService.verifyOTP(pinDto, "/2fa/2/pin");
  }

  private async verifyUserCountry(phoneNumber: string) {
    return phoneNumber.substring(0, 4);
  }

  private async sendSmsUsingProvider(
    provider: string,
    phoneNumber: string,
    message: string
  ) {
    switch (provider) {
      case SmsProviderType.Twilio:
        try {
          return await this.twilioService.sendOTP();
        } catch (error) {
          throw new Error(`Failed to send OTP using Twilio - ${error.message}`);
        }
      case SmsProviderType.InfoBip:
        try {
          return await this.infoBipService.sendOTPSMS(
            "/2fa/2/pin",
            phoneNumber,
            message
          );
        } catch (error) {
          throw new Error(
            `Failed to send OTP using InfoBip - ${error.message}`
          );
        }
    }
  }
}
