import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { AddressEntity } from 'src/addresses/address.entity';

describe('AddressesService', () => {
  let repo: jest.Mocked<Repository<AddressEntity>>;
  let service: AddressesService;

  beforeEach(() => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    service = new AddressesService(repo as any);
  });

  it('get(): non-existing -> throws NotFoundException (404)', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.get('student-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('get(): existing -> maps to DTO', async () => {
    repo.findOne.mockResolvedValue({
      studentId: 'sid',
      address: 'Addr',
    } as AddressEntity);

    const res = await service.get('sid');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { studentId: 'sid' } });
    expect(res).toEqual({ id: 'sid', address: 'Addr' });
  });

  it('upsert(): trims address, saves and maps to DTO', async () => {
    repo.save.mockImplementation(async (e: any) => e);

    const res = await service.upsert('sid', { address: '  X  ' } as any);

    expect(repo.save).toHaveBeenCalledWith({ studentId: 'sid', address: 'X' });
    expect(res).toEqual({ id: 'sid', address: 'X' });
  });
});
