import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpsertAddressDto {
  @ApiProperty({ example: '123 Main Street, Funkytown' })
  @IsString()
  @IsNotEmpty()
  address!: string;
}
