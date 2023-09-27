import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Twilio } from "twilio";

@Injectable()
export class TwilioService {
  client: Twilio;
  constructor(private readonly configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>("TWILIO_ACCOUNT_SID"),
      this.configService.get<string>("TWILIO_AUTH_TOKEN")
    );
  }

  async sendSMS(destinationNumber: string, message: string) {
    try {
      return await this.client.messages
        .create({
          from: this.configService.get<string>("TWILIO_PHONE_NUMBER"),
          to: destinationNumber,
          body: message,
        })
        .then((res) => this.parseSuccessResponse(res))
        .catch((err) => this.parseFailedResponse(err));

    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }

  async parseSuccessResponse(axiosResponse): Promise<ResponseType> {
    return {
      success: true,
      status: axiosResponse.status,
    } as unknown as ResponseType;
  }

  
  async parseFailedResponse(axiosError): Promise<ResponseType> {
    if (axiosError) {
      return {
        success: false,
        errorDetails: axiosError,
      } as unknown as ResponseType;
    }
  }

  // async sendOTPSMS(destinationNumber: string) {
  //   try {
  //     const smsResponse = await this.client.verify.v2
  //       .services(this.configService.get<string>("TWILIO_PHONE_NUMBER"))
  //       .verifications.create({ to: destinationNumber, channel: "sms" })
  //       .then((verification) => console.log(verification.sid));
  //       console.log('smsResponse', smsResponse)
  //     return smsResponse;
  //   } catch (error) {
  //     console.log('error', error)
  //     error.statusCode = 400;
  //     throw error;
  //   }
  // }

  // async verifyOTP(destinationNumber: string, otp: string) {
  //   try {
  //     const response = await this.client.verify.v2
  //       .services(this.configService.get<string>("TWILIO_ACCOUNT_SID"))
  //       .verificationChecks.create({
  //         to: destinationNumber,
  //         code: otp,
  //       });
  //       console.log('response', response)
  //     return response;
  //   } catch (error) {
  //     error.statusCode = 400;
  //     throw error;
  //   }
  // }
}
