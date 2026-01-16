import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty() statusCode!: number;
  @ApiProperty() message!: string | string[];
  @ApiProperty() error!: string;
  @ApiProperty() path!: string;
  @ApiProperty() timestamp!: string;
  @ApiProperty({ required: false }) requestId?: string;
}
