import { StudentsController } from 'src/students/students.controller';
import { StudentsService } from 'src/students/students.service';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: jest.Mocked<StudentsService>;

  beforeEach(() => {
    service = {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    controller = new StudentsController(service);
  });

  it('list() delegates to service.list()', async () => {
    service.list.mockResolvedValue([
      { id: '1', name: 'A', email: 'a@example.com' } as any,
    ]);

    const res = await controller.list();

    expect(service.list).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: '1', name: 'A', email: 'a@example.com' }]);
  });

  it('create() delegates to service.create(dto)', async () => {
    service.create.mockResolvedValue({ id: '1' } as any);

    const dto = { name: 'A', email: 'a@example.com' } as any;
    const res = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: '1' });
  });

  it('upsert() delegates to service.update(id, dto)', async () => {
    service.update.mockResolvedValue({ id: 'x' } as any);

    const dto = { name: 'B', email: 'b@example.com' } as any;
    const res = await controller.upsert('x', dto);

    expect(service.update).toHaveBeenCalledWith('x', dto);
    expect(res).toEqual({ id: 'x' });
  });

  it('remove() delegates to service.remove(id)', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove('x');

    expect(service.remove).toHaveBeenCalledWith('x');
  });
});
