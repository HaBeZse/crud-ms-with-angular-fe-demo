import { Module } from '@nestjs/common';
import { AddressesController } from './addresses/addresses.controller';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [AddressesModule],
})
export class AddressesServiceModule {}
