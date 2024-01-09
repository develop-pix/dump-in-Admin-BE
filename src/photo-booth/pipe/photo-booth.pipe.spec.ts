import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothPipe } from './photo-booth.pipe';
import { PhotoBoothService } from '../photo-booth.service';

class MockPhotoBoothService {
  hasPhotoBoothId = jest.fn();
}

describe('PhotoBoothPipe', () => {
  let photoBoothPipe: PhotoBoothPipe;
  let photoBoothService: PhotoBoothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoBoothPipe,
        { provide: PhotoBoothService, useClass: MockPhotoBoothService },
      ],
    }).compile();

    photoBoothPipe = module.get<PhotoBoothPipe>(PhotoBoothPipe);
    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(photoBoothPipe).toBeDefined();
    expect(photoBoothService).toBeDefined();
  });

  describe('transform', () => {
    it('FAILURE: 포토부스 아이디가 이미 존재하면, ConflictException throw', async () => {
      const photoBoothId = 'photo-booth-id';
      const mockHasId = jest
        .spyOn(photoBoothService, 'hasPhotoBoothId')
        .mockReturnValue(true);

      await expect(photoBoothPipe.transform(photoBoothId)).rejects.toThrow(
        ConflictException,
      );
      expect(mockHasId).toHaveBeenCalledWith(photoBoothId);
    });

    it('SUCCESS: 포토부스 아이디가 존재하지 않으면, photoBoothId를 그대로 반환', async () => {
      const photoBoothId = 'photo-booth-id';
      const mockHasId = jest
        .spyOn(photoBoothService, 'hasPhotoBoothId')
        .mockReturnValue(false);

      const result = await photoBoothPipe.transform(photoBoothId);

      expect(result).toEqual(photoBoothId);
      expect(mockHasId).toHaveBeenCalledWith(photoBoothId);
    });
  });
});
