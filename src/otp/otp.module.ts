import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { OTPController } from "./otp.controller";
import { SmsService } from "../sms/sms.service";
import { SmsModule } from "../sms/sms.module";

@Module({
  controllers: [OTPController],
  providers: [OtpService],
  imports: [SmsModule],
  exports: [OtpService],
})
export class OtpModule {}
