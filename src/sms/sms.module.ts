import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { InfoBipService } from '../sms-providers/info-bip/info-bip.service';
import { TwilioService } from '../sms-providers/twilio/twilio.service';
import { InfoBipModule } from '../sms-providers/info-bip/info-bip.module';
import { TwilioModule } from '../sms-providers/twilio/twilio.module';

@Module({
    providers: [SmsService],
    imports: [InfoBipModule, TwilioModule],
    exports: [SmsService]
})
export class SmsModule {}
