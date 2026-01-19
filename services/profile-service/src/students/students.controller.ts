import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { StudentsService } from './students.service';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOkResponse({ type: StudentDto, isArray: true })
  list(): Promise<StudentDto[]> {
    return this.studentsService.list();
  }

  @Post()
  @ApiCreatedResponse({ type: StudentDto })
  @ApiBadRequestResponse({
    description: 'Validation Error',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    type: ErrorResponseDto,
  })
  create(@Body() dto: CreateStudentDto): Promise<StudentDto> {
    return this.studentsService.create(dto);
  }

  @Put(':id')
  @ApiOkResponse({ type: StudentDto })
  @ApiBadRequestResponse({
    description: 'Validation Error',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Student Not Found',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    type: ErrorResponseDto,
  })
  upsert(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<StudentDto> {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiNotFoundResponse({
    description: 'Student Not Found',
    type: ErrorResponseDto,
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.studentsService.remove(id);
  }
}
