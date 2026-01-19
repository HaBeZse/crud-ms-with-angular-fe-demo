import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { StudentEntity } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentsRepo: Repository<StudentEntity>,
  ) {}

  async list(): Promise<StudentDto[]> {
    const students = await this.studentsRepo.find({ order: { name: 'ASC' } });
    return students.map(this.toDto);
  }

  async create(dto: CreateStudentDto): Promise<StudentDto> {
    const entity: StudentEntity = {
      id: randomUUID(),
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
    };

    try {
      const saved = await this.studentsRepo.save(entity);
      return this.toDto(saved);
    } catch (err: any) {
      this.throwIfUniqueViolation(err);
      throw err;
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<StudentDto> {
    const existing = await this.studentsRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Student not found');
    }
    existing.name = dto.name.trim();
    existing.email = dto.email.trim().toLowerCase();

    try {
      const saved = await this.studentsRepo.save(existing);
      return this.toDto(saved);
    } catch (err: any) {
      this.throwIfUniqueViolation(err);
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentsRepo.delete({ id });
    if (!result.affected) {
      throw new NotFoundException('Student not found');
    }
  }

  private toDto(entity: StudentEntity): StudentDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
    };
  }

  private throwIfUniqueViolation(err: any) {
    const pgCode = err?.code ?? err?.driverError?.code;
    const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';
    if (pgCode === POSTGRES_UNIQUE_VIOLATION_CODE) {
      throw new ConflictException('Email already exists');
    }
  }
}
