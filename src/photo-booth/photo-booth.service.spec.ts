import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothService } from './photo-booth.service';

describe('PhotoBoothService', () => {
  let service: PhotoBoothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoBoothService],
    }).compile();

    service = module.get<PhotoBoothService>(PhotoBoothService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
