import { Injectable } from "@nestjs/common";
import { OtpDto } from "./otp.dto";
import { SmsService } from "../sms/sms.service";

@Injectable()
export class OtpService {

    constructor(private readonly smsService: SmsService) {}

    async sendOtp (otpData: OtpDto) {
     return this.smsService.sendOTPSms(otpData);
    }
}