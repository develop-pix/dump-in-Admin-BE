import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothController } from './photo-booth.controller';
import { PhotoBoothService } from './photo-booth.service';

describe('PhotoBoothController', () => {
  let controller: PhotoBoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoBoothController],
      providers: [PhotoBoothService],
    }).compile();

    controller = module.get<PhotoBoothController>(PhotoBoothController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
