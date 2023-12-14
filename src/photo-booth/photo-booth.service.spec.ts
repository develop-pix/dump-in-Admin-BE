import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';
import { PhotoBooth } from './entity/photo-booth.entity';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PhotoBoothBrand } from './entity/photo-booth-brand.entity';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { HashtagService } from '../hashtag/hashtag.service';

class MockPhotoBoothRepository {
  findBoothByOptionAndCount = jest.fn();
  findOneBooth = jest.fn();
  saveOpenBooth = jest.fn();
  updatePhotoBooth = jest.fn();
  deletePhotoBooth = jest.fn();
  photoBoothHasId = jest.fn();
}

class MockHiddenPhotoBoothRepository {
  findHiddenBoothByOptionAndCount = jest.fn();
  findOneHiddenBooth = jest.fn();
  updateHiddenBooth = jest.fn();
}

class MockPhotoBoothBrandRepository {
  saveBrand = jest.fn();
  findBrandByOptionAndCount = jest.fn();
  findOneBrand = jest.fn();
  updateBoothBrand = jest.fn();
  isExistBrand = jest.fn();
}

class MockHashtagService {}

describe('PhotoBoothService', () => {
  let hashtagService: HashtagService;
  let photoBoothService: PhotoBoothService;
  let photoBoothRepository: PhotoBoothRepository;
  let photoBoothHiddenRepository: HiddenBoothRepository;
  let photoBoothBrandRepository: PhotoBoothBrandRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoBoothService,
        { provide: HashtagService, useClass: MockHashtagService },
        { provide: PhotoBoothRepository, useClass: MockPhotoBoothRepository },
        {
          provide: HiddenBoothRepository,
          useClass: MockHiddenPhotoBoothRepository,
        },
        {
          provide: PhotoBoothBrandRepository,
          useClass: MockPhotoBoothBrandRepository,
        },
      ],
    }).compile();

    hashtagService = module.get<HashtagService>(HashtagService);
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
        const savedPhotoBooth = new PhotoBooth();
        if (booth.location === '서울') {
          savedPhotoBooth.location = booth.location;
          return Promise.resolve([[savedPhotoBooth], 1]);
        } else if (booth.name === '포토그레이') {
          savedPhotoBooth.name = booth.name;
          return Promise.resolve([[savedPhotoBooth], 1]);
        } else {
          return Promise.resolve([[], 0]);
        }
      });

    jest
      .spyOn(photoBoothRepository, 'findOneBooth')
      .mockImplementation((booth: PhotoBooth) => {
        if (booth.id === 'uuid') {
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

    jest
      .spyOn(photoBoothRepository, 'deletePhotoBooth')
      .mockImplementation((id: string) => {
        if (id === 'uuid') {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });

    jest
      .spyOn(photoBoothRepository, 'photoBoothHasId')
      .mockImplementation((booth: PhotoBooth) => {
        if (booth.id === 'existId') {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });

    jest
      .spyOn(photoBoothHiddenRepository, 'updateHiddenBooth')
      .mockImplementation((id: string) => {
        if (id === 'uuid') {
          return Promise.resolve(true);
        } else if (id === 'notExistId') {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });

    jest
      .spyOn(photoBoothBrandRepository, 'findOneBrand')
      .mockImplementation((brand: PhotoBoothBrand) => {
        if (brand.name === '업체명') {
          const saveBrand = new PhotoBoothBrand();
          saveBrand.name = '업체명';
          return Promise.resolve(saveBrand);
        } else {
          return Promise.resolve(null);
        }
      });

    jest
      .spyOn(photoBoothBrandRepository, 'isExistBrand')
      .mockImplementation((brand: PhotoBoothBrand) => {
        if (brand.name === '업체명') {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(null);
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(hashtagService).toBeDefined();
    expect(photoBoothService).toBeDefined();
    expect(photoBoothRepository).toBeDefined();
    expect(photoBoothBrandRepository).toBeDefined();
    expect(photoBoothHiddenRepository).toBeDefined();
  });

  describe('findBoothByOptionAndCount()', () => {
    const pageProps = {
      take: 10,
      skip: 1,
      page: 1,
    };

    it('SUCCESS: 지역이나 이름으로 쿼리하면 데이터 반환', async () => {
      // Given
      const booth = new PhotoBooth();
      booth.name = '포토그레이';

      const [photoBoothsInDb] =
        await photoBoothRepository.findBoothByOptionAndCount(booth, pageProps);

      const expectedResult = photoBoothsInDb.map(
        (photoBooth) => new GetPhotoBoothListDto(photoBooth),
      );

      // When
      const [result] = await photoBoothService.findOpenBoothByQueryParam(
        pageProps,
        booth,
      );

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: 포토부스가 존재하지 않으면 404 에러', async () => {
      // Given
      const booth = new PhotoBooth();
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

      const photoBoothInDb = await photoBoothRepository.findOneBooth(
        PhotoBooth.byId(id),
      );

      // When
      const result = await photoBoothService.findOneOpenBooth(id);

      // Then
      expect(result).toEqual(photoBoothInDb);
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
    it('SUCCESS: uuid 값이 존재할 때 전달 받은 정보로 업데이트 (boolean)', async () => {
      // Given
      const id = 'uuid';
      const photoBoothUpdateProps = {
        name: '포토부스 이름',
        location: '지역',
        streetAddress: '지번 주소',
        roadAddress: '도로명 주소',
        brandName: '업체명',
        isDelete: false,
      };

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

    it('SUCCESS: 수정할 속성에 업체명이 존재할 때 업체명 업데이트 (boolean)', async () => {
      // Given
      const id = 'uuid';
      const photoBoothUpdateProps = {
        name: '포토부스 이름',
        location: '지역',
        streetAddress: '지번 주소',
        roadAddress: '도로명 주소',
        brandName: '업체명',
        isDelete: false,
      };

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
      const photoBoothUpdateProps = {
        name: '포토부스 이름',
        location: '지역',
        streetAddress: '지번 주소',
        roadAddress: '도로명 주소',
        brandName: '업체명',
        isDelete: false,
      };

      // When & Then
      expect(async () => {
        await photoBoothService.updateOpenBooth(
          notBoothId,
          photoBoothUpdateProps,
        );
      }).rejects.toThrowError(
        new NotFoundException(`포토부스를 찾지 못했습니다. ID:${notBoothId}`),
      );
    });

    it('FAILURE: 수정해야할 업체명이 존재하지 않을 때 404 에러', async () => {
      // Given
      const id = 'uuid';
      const photoBoothUpdateProps = {
        name: '포토부스 이름',
        location: '지역',
        streetAddress: '지번 주소',
        roadAddress: '도로명 주소',
        brandName: '업체명이 없을 때',
        isDelete: false,
      };
      // When & Then
      expect(async () => {
        await photoBoothService.updateOpenBooth(id, photoBoothUpdateProps);
      }).rejects.toThrowError(
        new NotFoundException('포토부스 업체를 찾지 못했습니다.'),
      );
    });
  });

  describe('deleteOpenBooth()', () => {
    it('SUCCESS: uuid 값이 존재할 때 해당 id의 포토부스 지점을 삭제하고 hiddenBooth로 이동 (boolean)', async () => {
      // Given
      const id = 'uuid';

      const photoBoothInDb = await photoBoothRepository.deletePhotoBooth(id);

      // When
      const result = await photoBoothService.deleteOpenBooth(id);

      // Then
      expect(result).toEqual(photoBoothInDb);
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBoothId = 'not uuid';

      // When & Then
      expect(async () => {
        await photoBoothService.deleteOpenBooth(notBoothId);
      }).rejects.toThrowError(
        new NotFoundException(`포토부스 삭제가 불가능합니다. ID:${notBoothId}`),
      );
    });
  });

  describe('updateHiddenBooth()', () => {
    it('SUCCESS: uuid 값이 존재할 때 전달 받은 정보로 업데이트 (boolean)', async () => {
      // Given
      const id = 'uuid';
      const photoBoothUpdateProps = {
        name: '포토부스 이름',
        location: '지역',
        streetAddress: '지번 주소',
        roadAddress: '도로명 주소',
        isDelete: false,
      };

      const hiddenBoothInDb =
        await photoBoothHiddenRepository.updateHiddenBooth(
          id,
          HiddenPhotoBooth.updateBy(photoBoothUpdateProps),
        );

      // When
      const result = await photoBoothService.updateHiddenBooth(
        id,
        photoBoothUpdateProps,
      );

      // Then
      expect(result).toEqual(hiddenBoothInDb);
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBoothId = 'not uuid';
      const photoBoothUpdateProps = {
        name: '포토부스 이름',
        location: '지역',
        streetAddress: '지번 주소',
        roadAddress: '도로명 주소',
        isDelete: false,
      };

      // When & Then
      expect(async () => {
        await photoBoothService.updateHiddenBooth(
          notBoothId,
          photoBoothUpdateProps,
        );
      }).rejects.toThrowError(
        new NotFoundException(
          `비공개 포토부스 업데이트가 불가능합니다. ID:${notBoothId}`,
        ),
      );
    });
  });

  describe('moveHiddenToOpenBooth()', () => {
    const photoBoothUpdateProps = {
      name: '포토부스 이름',
      location: '지역',
      latitude: 0,
      longitude: 0,
      streetAddress: '지번 주소',
      roadAddress: '도로명 주소',
      brandName: '업체명',
      operationTime: '운영 시간',
      isDelete: true,
    };

    it('SUCCESS: 공개된 포토부스에 uuid 값이 없을 때 비공개 포토부스에서 공개포토부스로 이동 (boolean)', async () => {
      // Given
      const id = 'notExistId';

      const isPhotoBoothExist = await photoBoothRepository.photoBoothHasId(
        PhotoBooth.byId(id),
      );

      // When
      const result = await photoBoothService.moveHiddenToOpenBooth(
        id,
        photoBoothUpdateProps,
      );

      // Then
      expect(result).toEqual(!isPhotoBoothExist);
    });

    it('FAILURE: 공개 포토부스에 uuid 값이 존재할 때 404 에러', async () => {
      // Given
      const id = 'existId';

      // When & Then
      expect(async () => {
        await photoBoothService.moveHiddenToOpenBooth(
          id,
          photoBoothUpdateProps,
        );
      }).rejects.toThrowError(
        new BadRequestException('이미 포토부스가 존재합니다'),
      );
    });

    it('FAILURE: 비공개 포토부스에 업체명이 존재하지 않을 때 404 에러', async () => {
      // Given
      const id = 'uuid';
      photoBoothUpdateProps.brandName = '업체명이 없을 때';

      // When & Then
      expect(async () => {
        await photoBoothService.moveHiddenToOpenBooth(
          id,
          photoBoothUpdateProps,
        );
      }).rejects.toThrowError(
        new NotFoundException('포토부스 업체를 찾지 못했습니다.'),
      );
    });
  });
});
