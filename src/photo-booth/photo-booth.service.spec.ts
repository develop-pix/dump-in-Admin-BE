import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { PhotoBoothRawRepository } from './repository/photo-booth-raw-data.repository';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';
import { BoothQueryDto } from './dto/get-photo-booth-query.dto';
import { PhotoBooth } from './entity/photo-booth.entity';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { Page } from '../common/dto/paginated-res.dto';
import { NotFoundException } from '@nestjs/common';
import { GetPhotoBoothDetailDto } from './dto/get-photo-booth-detail.dto';

class MockPhotoBoothRepository {
  findBoothByOptionAndCount = jest.fn();
  findOneBoothById = jest.fn();
}

class MockPhotoBoothRawRepository {
  // mockMethod = jest.fn();
}

class MockPhotoBoothBrandRepository {
  // mockMethod = jest.fn();
}

describe('PhotoBoothService', () => {
  let photoBoothService: PhotoBoothService;
  let photoBoothRepository: PhotoBoothRepository;
  let photoBoothRawRepository: PhotoBoothRawRepository;
  let photoBoothBrandRepository: PhotoBoothBrandRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoBoothService,
        { provide: PhotoBoothRepository, useClass: MockPhotoBoothRepository },
        {
          provide: PhotoBoothRawRepository,
          useClass: MockPhotoBoothRawRepository,
        },
        {
          provide: PhotoBoothBrandRepository,
          useClass: MockPhotoBoothBrandRepository,
        },
      ],
    }).compile();

    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);
    photoBoothRepository =
      module.get<PhotoBoothRepository>(PhotoBoothRepository);
    photoBoothRawRepository = module.get<PhotoBoothRawRepository>(
      PhotoBoothRawRepository,
    );
    photoBoothBrandRepository = module.get<PhotoBoothBrandRepository>(
      PhotoBoothBrandRepository,
    );

    jest
      .spyOn(photoBoothRepository, 'findBoothByOptionAndCount')
      .mockImplementation((request: BoothQueryDto) => {
        const { location, name } = request.getQueryProps();
        const savePhotoBooth = (
          id: string,
          name: string,
          location: string,
        ): PhotoBooth => {
          const booth = new PhotoBooth();
          booth.id = id;
          booth.name = name;
          booth.location = location;
          return booth;
        };

        let mockPhotoBoothArray: PhotoBooth[] = [];

        if (location === '서울') {
          mockPhotoBoothArray = [savePhotoBooth('uuid', '하루필름', '서울')];
        } else if (name === '포토그레이') {
          mockPhotoBoothArray = [savePhotoBooth('uuid', '포토그레이', '수원')];
        } else if (!name && !location) {
          mockPhotoBoothArray = [savePhotoBooth('uuid', '지점명', '부산')];
        }

        return Promise.resolve([
          mockPhotoBoothArray,
          mockPhotoBoothArray.length,
        ]);
      });

    jest
      .spyOn(photoBoothRepository, 'findOneBoothById')
      .mockImplementation((id: string) => {
        if (id === 'uuid') {
          const savePhotoBooth = new PhotoBooth();
          savePhotoBooth.id = 'uuid';
          savePhotoBooth.name = '하루필름';
          savePhotoBooth.location = '서울';

          return Promise.resolve(savePhotoBooth);
        } else {
          return Promise.resolve(null);
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(photoBoothService).toBeDefined();
    expect(photoBoothRepository).toBeDefined();
    expect(photoBoothRawRepository).toBeDefined();
    expect(photoBoothBrandRepository).toBeDefined();
  });

  describe('findBoothByOptionAndCount()', () => {
    it('SUCCESS: 포토부스 데이터 반환', async () => {
      // Given
      const boothQueryDto = new BoothQueryDto();

      const [photoBoothsInDb, count] =
        await photoBoothRepository.findBoothByOptionAndCount(boothQueryDto);

      const photoBoothResult = photoBoothsInDb.map(
        (photoBooth) => new GetPhotoBoothListDto(photoBooth),
      );

      const expectedResult = new Page<GetPhotoBoothListDto>(
        boothQueryDto.page,
        boothQueryDto.take,
        count,
        photoBoothResult,
      );

      // When
      const result =
        await photoBoothService.findOpenBoothByQueryParam(boothQueryDto);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('SUCCESS: 지역이나 이름으로 쿼리하면 데이터 반환', async () => {
      // Given
      const boothQueryDto = new BoothQueryDto();
      boothQueryDto.name = '포토그레이';

      const [photoBoothsInDb, count] =
        await photoBoothRepository.findBoothByOptionAndCount(boothQueryDto);

      const photoBoothResult = photoBoothsInDb.map(
        (photoBooth) => new GetPhotoBoothListDto(photoBooth),
      );

      const expectedResult = new Page<GetPhotoBoothListDto>(
        boothQueryDto.page,
        boothQueryDto.take,
        count,
        photoBoothResult,
      );

      // When
      const result =
        await photoBoothService.findOpenBoothByQueryParam(boothQueryDto);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: 포토부스가 존재하지 않으면 404 에러', async () => {
      // Given
      const boothQueryDto = new BoothQueryDto();
      boothQueryDto.location = '경기';

      // When & Then
      expect(async () => {
        await photoBoothService.findOpenBoothByQueryParam(boothQueryDto);
      }).rejects.toThrowError(
        new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다'),
      );
    });
  });

  describe('findOneOpenBooth()', () => {
    it('SUCCESS: uuid 값이 존재할 때 데이터 반환', async () => {
      // Given
      const uuid = 'uuid';

      const photoBoothInDb = await photoBoothRepository.findOneBoothById(uuid);

      const expectedResult = new GetPhotoBoothDetailDto(photoBoothInDb);

      // When
      const result = await photoBoothService.findOneOpenBooth(uuid);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notUuid = 'not uuid';

      // When & Then
      expect(async () => {
        await photoBoothService.findOneOpenBooth(notUuid);
      }).rejects.toThrowError(
        new NotFoundException(
          `포토부스 지점을 찾지 못했습니다. ID: ${notUuid}`,
        ),
      );
    });
  });
});
