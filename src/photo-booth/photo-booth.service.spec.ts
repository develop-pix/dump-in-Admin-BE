import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';
import { PhotoBooth } from './entity/photo-booth.entity';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { Page } from '../common/dto/paginated-res.dto';
import { NotFoundException } from '@nestjs/common';
import { GetPhotoBoothDetailDto } from './dto/get-photo-booth-detail.dto';

class MockPhotoBoothRepository {
  findBoothByOptionAndCount = jest.fn();
  findOneBoothBy = jest.fn();
  updatePhotoBooth = jest.fn();
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
  let photoBoothHiddenRepository: HiddenBoothRepository;
  let photoBoothBrandRepository: PhotoBoothBrandRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoBoothService,
        { provide: PhotoBoothRepository, useClass: MockPhotoBoothRepository },
        {
          provide: HiddenBoothRepository,
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
    photoBoothHiddenRepository = module.get<HiddenBoothRepository>(
      HiddenBoothRepository,
    );
    photoBoothBrandRepository = module.get<PhotoBoothBrandRepository>(
      PhotoBoothBrandRepository,
    );

    jest
      .spyOn(photoBoothRepository, 'findBoothByOptionAndCount')
      .mockImplementation((booth: PhotoBooth) => {
        const { location, name } = booth;
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
      .spyOn(photoBoothRepository, 'findOneBoothBy')
      .mockImplementation((booth: PhotoBooth) => {
        const { id } = booth;

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

    jest
      .spyOn(photoBoothRepository, 'updatePhotoBooth')
      .mockImplementation((id: string) => {
        if (id === 'uuid') {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(photoBoothService).toBeDefined();
    expect(photoBoothRepository).toBeDefined();
    expect(photoBoothHiddenRepository).toBeDefined();
    expect(photoBoothBrandRepository).toBeDefined();
  });

  describe('findBoothByOptionAndCount()', () => {
    it('SUCCESS: 포토부스 데이터 반환', async () => {
      // Given
      const booth = new PhotoBooth();
      const pageProps = {
        take: 10,
        skip: 1,
        page: 1,
      };

      const [photoBoothsInDb, count] =
        await photoBoothRepository.findBoothByOptionAndCount(booth, pageProps);

      const photoBoothResult = photoBoothsInDb.map(
        (photoBooth) => new GetPhotoBoothListDto(photoBooth),
      );

      const expectedResult = new Page<GetPhotoBoothListDto>(
        pageProps.page,
        pageProps.take,
        count,
        photoBoothResult,
      );

      // When
      const result = await photoBoothService.findOpenBoothByQueryParam(
        pageProps,
        booth,
      );

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('SUCCESS: 지역이나 이름으로 쿼리하면 데이터 반환', async () => {
      // Given
      const booth = new PhotoBooth();
      const pageProps = {
        take: 10,
        skip: 1,
        page: 1,
      };

      booth.name = '포토그레이';

      const [photoBoothsInDb, count] =
        await photoBoothRepository.findBoothByOptionAndCount(booth, pageProps);

      const photoBoothResult = photoBoothsInDb.map(
        (photoBooth) => new GetPhotoBoothListDto(photoBooth),
      );

      const expectedResult = new Page<GetPhotoBoothListDto>(
        pageProps.page,
        pageProps.take,
        count,
        photoBoothResult,
      );

      // When
      const result = await photoBoothService.findOpenBoothByQueryParam(
        pageProps,
        booth,
      );

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: 포토부스가 존재하지 않으면 404 에러', async () => {
      // Given
      const booth = new PhotoBooth();
      const pageProps = {
        take: 10,
        skip: 1,
        page: 1,
      };
      booth.location = '경기';

      // When & Then
      expect(async () => {
        await photoBoothService.findOpenBoothByQueryParam(pageProps, booth);
      }).rejects.toThrowError(
        new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다'),
      );
    });
  });

  describe('findOneOpenBooth()', () => {
    it('SUCCESS: uuid 값이 존재할 때 데이터 반환', async () => {
      // Given
      const id = 'uuid';

      const photoBoothInDb = await photoBoothRepository.findOneBoothBy(
        PhotoBooth.byId({ id }),
      );

      const expectedResult = new GetPhotoBoothDetailDto(photoBoothInDb);

      // When
      const result = await photoBoothService.findOneOpenBooth(id);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBoothId = 'not uuid';

      // When & Then
      expect(async () => {
        await photoBoothService.findOneOpenBooth(notBoothId);
      }).rejects.toThrowError(
        new NotFoundException(
          `포토부스 지점을 찾지 못했습니다. ID: ${notBoothId}`,
        ),
      );
    });
  });

  describe('updateOpenBooth()', () => {
    const photoBoothUpdateProps = {
      name: 'string',
      location: 'string',
      streetAddress: 'string',
      roadAddress: 'string',
      isDelete: false,
    };

    it('SUCCESS: uuid 값이 존재할 때 전달 받은 정보로 업데이트 (boolean)', async () => {
      // Given
      const id = 'uuid';

      const photoBoothInDb = await photoBoothRepository.updatePhotoBooth(
        id,
        PhotoBooth.updateBy(photoBoothUpdateProps),
      );

      // When
      const result = await photoBoothService.updateOpenBooth(
        id,
        photoBoothUpdateProps,
      );

      // Then
      expect(result).toEqual(photoBoothInDb);
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBoothId = 'not uuid';

      // When & Then
      expect(async () => {
        await photoBoothService.updateOpenBooth(
          notBoothId,
          photoBoothUpdateProps,
        );
      }).rejects.toThrowError(
        new NotFoundException(
          `포토부스가 업데이트되지 않았습니다. ID:${notBoothId}`,
        ),
      );
    });
  });
});
