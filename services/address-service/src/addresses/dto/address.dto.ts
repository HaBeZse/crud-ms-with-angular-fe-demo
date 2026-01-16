import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  address!: string;
}
