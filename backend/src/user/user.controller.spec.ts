import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
            createUser: jest.fn().mockResolvedValue({
              id: 1,
              email: 'test@test.com',
              role: 'USER',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll method', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findOne method', async () => {
    const id = 1;
    await controller.findOne(id.toString());
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  describe('createUser', () => {
    it('should call createUser method of UserService with correct parameters', async () => {
      const body = { email: 'test@test.com', password: '123456', role: 'USER' };
      await controller.createUser(body);
      expect(service.createUser).toHaveBeenCalledWith(body.email, body.password);
    });

    it('should return the created user object', async () => {
      const body = { email: 'test@test.com', password: '123456', role: 'USER' };
      const result = await controller.createUser(body);
      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        role: 'USER',
      });
    });
  });
});
