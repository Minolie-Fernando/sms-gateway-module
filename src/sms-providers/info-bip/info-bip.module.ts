import { Module } from '@nestjs/common';
import { InfoBipService } from './info-bip.service';

@Module({
    providers: [InfoBipService],
    exports: [InfoBipService]
})
export class InfoBipModule {}
