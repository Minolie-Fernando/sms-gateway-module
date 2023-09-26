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
      const smsResponse = await this.client.messages.create({
        from: this.configService.get<string>("TWILIO_PHONE_NUMBER"),
        to: destinationNumber,
        body: message,
      });
      console.log(smsResponse.sid);
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }

  async sendOTPSMS(destinationNumber: string) {
    try {
      const smsResponse = await this.client.verify.v2
        .services(this.configService.get<string>("TWILIO_ACCOUNT_SID"))
        .verifications.create({ to: destinationNumber, channel: "sms" })
        .then((verification) => console.log(verification.sid));
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }

  async verifyOTP(destinationNumber: string, otp: string) {
    try {
      const response = await this.client.verify.v2
        .services(this.configService.get<string>("TWILIO_ACCOUNT_SID"))
        .verificationChecks.create({
          to: destinationNumber,
          code: otp,
        });
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }
}
