import { Body, Controller, Post } from "@nestjs/common";
import { OtpDto, PinDto } from "./otp.dto";
import { OtpService } from "./otp.service";

@Controller()
export class OTPController {
  constructor(private readonly otpService: OtpService) {}

  @Post("send-sms")
  async sendOtp(@Body() otpDto: OtpDto) {
    return this.otpService.sendOtp(otpDto);
  }

  // @Post("verify-otp")
  // async verifyOtp(@Body() pinDto: PinDto) {
  //   return this.otpService.verifyOtp(pinDto);
  // }
}
