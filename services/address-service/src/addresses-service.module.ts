import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from './addresses/addresses.module';
import { AddressEntity } from './addresses/address.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('POSTGRES_HOST', 'localhost'),
        port: parseInt(cfg.get('POSTGRES_PORT', '5432'), 10),
        username: cfg.get('POSTGRES_USER', 'postgres'),
        password: cfg.get('POSTGRES_PASSWORD', 'postgres'),
        database: cfg.get('POSTGRES_DB', 'students'),
        schema: 'address',
        entities: [AddressEntity],
        synchronize: false,
        logging: false,
      }),
    }),
    AddressesModule,
  ],
})
export class AddressesServiceModule {}
