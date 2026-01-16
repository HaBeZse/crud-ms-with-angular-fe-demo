import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Teszt Elek' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'teszt.elek@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
