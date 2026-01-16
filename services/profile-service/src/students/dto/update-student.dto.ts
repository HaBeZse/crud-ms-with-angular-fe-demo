import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({ example: 'Teszt Elek' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'teszt.elek@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
