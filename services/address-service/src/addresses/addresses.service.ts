import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { UpsertAddressDto } from './dto/upsert-address.dto';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>,
  ) {}

  async get(studentId: string): Promise<AddressDto> {
    const found = await this.addressRepo.findOne({ where: { studentId } });
    if (!found) {
      throw new NotFoundException('Address not found');
    }
    return this.toDto(found);
  }

  async upsert(studentId: string, dto: UpsertAddressDto): Promise<AddressDto> {
    const saved = await this.addressRepo.save({
      studentId,
      address: dto.address.trim(),
    });
    return this.toDto(saved);
  }

  private toDto(entity: AddressEntity): AddressDto {
    return { id: entity.studentId, address: entity.address };
  }
}
