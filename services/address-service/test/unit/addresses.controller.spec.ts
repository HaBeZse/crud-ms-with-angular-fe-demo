import { AddressesController } from '../../src/addresses/addresses.controller';
import { AddressesService } from '../../src/addresses/addresses.service';

describe('AddressesController', () => {
  let controller: AddressesController;
  let service: jest.Mocked<AddressesService>;

  beforeEach(() => {
    service = {
      get: jest.fn(),
      upsert: jest.fn(),
    } as any;

    controller = new AddressesController(service);
  });

  it('get() -> delegates to service.get(studentId)', async () => {
    service.get.mockResolvedValue({ id: 'sid', address: 'Addr' } as any);

    const res = await controller.get('sid' as any);

    expect(service.get).toHaveBeenCalledWith('sid');
    expect(res).toEqual({ id: 'sid', address: 'Addr' });
  });

  it('upsert() -> delegates to service.upsert(studentId, dto)', async () => {
    service.upsert.mockResolvedValue({ id: 'sid', address: 'X' } as any);

    const dto = { address: 'X' } as any;
    const res = await controller.upsert('sid' as any, dto);

    expect(service.upsert).toHaveBeenCalledWith('sid', dto);
    expect(res).toEqual({ id: 'sid', address: 'X' });
  });
});
