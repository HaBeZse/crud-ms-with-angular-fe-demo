import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StudentsService } from '../../src/students/students.service';
import { StudentEntity } from '../../src/students/student.entity';

describe('StudentsService', () => {
  let repo: jest.Mocked<Repository<StudentEntity>>;
  let service: StudentsService;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new StudentsService(repo as any);
  });

  it('list() -> calls repo.find with order and maps to DTO', async () => {
    repo.find.mockResolvedValue([
      { id: 'id-1', name: 'B', email: 'b@example.com' } as StudentEntity,
    ]);

    const result = await service.list();

    expect(repo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
    expect(result).toEqual([{ id: 'id-1', name: 'B', email: 'b@example.com' }]);
  });

  it('create() -> trims name, lowercases email, returns DTO', async () => {
    repo.save.mockImplementation(async (e: any) => e);

    const res = await service.create({
      name: '  Lajos  ',
      email: '  LAJOS@EXAMPLE.COM  ',
    } as any);

    expect(repo.save).toHaveBeenCalled();
    const savedArg = (repo.save as jest.Mock).mock.calls[0][0];

    expect(savedArg.name).toBe('Lajos');
    expect(savedArg.email).toBe('lajos@example.com');
    expect(res.name).toBe('Lajos');
    expect(res.email).toBe('lajos@example.com');
    expect(res.id).toBeDefined();
  });

  it('create() -> duplicate email throws ConflictException (409)', async () => {
    repo.save.mockRejectedValue({ driverError: { code: '23505' } });

    await expect(
      service.create({ name: 'A', email: 'dup@example.com' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('update() -> non-existing throws NotFoundException (404)', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(
      service.update('missing-id', {
        name: 'X',
        email: 'x@example.com',
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update() -> existing saves and returns DTO', async () => {
    repo.findOne.mockResolvedValue({
      id: 'id-1',
      name: 'Old',
      email: 'old@example.com',
    } as StudentEntity);

    repo.save.mockImplementation(async (e: any) => e);

    const res = await service.update('id-1', {
      name: '  New  ',
      email: '  NEW@EXAMPLE.COM ',
    } as any);

    expect(repo.save).toHaveBeenCalled();
    expect(res).toEqual({
      id: 'id-1',
      name: 'New',
      email: 'new@example.com',
    });
  });

  it('update() -> duplicate email throws ConflictException (409)', async () => {
    repo.findOne.mockResolvedValue({
      id: 'id-1',
      name: 'A',
      email: 'a@example.com',
    } as StudentEntity);

    repo.save.mockRejectedValue({ code: '23505' });

    await expect(
      service.update('id-1', { name: 'A', email: 'dup@example.com' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('remove() -> affected=0 throws NotFoundException (404)', async () => {
    repo.delete.mockResolvedValue({ affected: 0 } as any);

    await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove() -> affected=1 resolves void', async () => {
    repo.delete.mockResolvedValue({ affected: 1 } as any);

    await expect(service.remove('id-1')).resolves.toBeUndefined();
  });
});
