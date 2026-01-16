import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;
}
