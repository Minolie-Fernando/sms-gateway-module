import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OtpModule } from "./otp/otp.module";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SmsModule } from './sms/sms.module';
import { TwilioModule } from './sms-providers/twilio/twilio.module';
import { InfoBipModule } from './sms-providers/info-bip/info-bip.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    OtpModule,
    UsersModule,
    SmsModule,
    TwilioModule,
    InfoBipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
