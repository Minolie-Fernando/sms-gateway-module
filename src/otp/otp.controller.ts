import { Body, Controller, Post } from "@nestjs/common";
import { OtpDto } from "./otp.dto";
import { OtpService } from "./otp.service";

@Controller()
export class OTPController {

    constructor(private readonly otpService: OtpService) {}

    @Post('send-otp')
    async sendOtp(
        @Body() otpDto: OtpDto
    ) {
        return this.otpService.sendOtp(otpDto)
    }
}