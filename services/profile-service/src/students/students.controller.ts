import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotImplementedException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StudentDto } from './dto/student.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  @Get()
  @ApiOkResponse({ type: StudentDto, isArray: true })
  list(): Promise<StudentDto[]> {
    throw new NotImplementedException();
  }

  @Post()
  @ApiCreatedResponse({ type: StudentDto })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @ApiConflictResponse({ description: 'Email already exists' })
  create(@Body() dto: CreateStudentDto): Promise<StudentDto[]> {
    throw new NotImplementedException();
  }

  @Put(':id')
  @ApiOkResponse({ type: StudentDto })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @ApiNotFoundResponse({ description: 'Student Not Found' })
  @ApiConflictResponse({ description: 'Email already exists' })
  upsert(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<StudentDto> {
    throw new NotImplementedException();
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiNotFoundResponse({ description: 'Student Not Found' })
  remove(@Param('id') id: string): Promise<void> {
    throw new NotImplementedException();
  }
}
