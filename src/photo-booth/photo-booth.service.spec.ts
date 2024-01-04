import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { PhotoBooth } from './entity/photo-booth.entity';
import { NotFoundException } from '@nestjs/common';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { BrandService } from '../brand/brand.service';
import { PhotoBoothBrand } from '../brand/entity/brand.entity';
import { ToBoothProps } from './photo-booth.interface';

class MockPhotoBoothRepository {
  findBoothByOptionAndCount = jest.fn();
  findOneBooth = jest.fn();
  save = jest.fn();
  remove = jest.fn();
}

class MockHiddenPhotoBoothRepository {
  findHiddenBoothByOptionAndCount = jest.fn();
  findOneHiddenBooth = jest.fn();
  save = jest.fn();
  merge = jest.fn();
}

class MockBrandService {
  findOneBrandBy = jest.fn();
}

describe('PhotoBoothService', () => {
  let photoBoothService: PhotoBoothService;
  let photoBoothRepository: PhotoBoothRepository;
  let photoBoothHiddenRepository: HiddenBoothRepository;
  let brandService: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoBoothService,
        { provide: PhotoBoothRepository, useClass: MockPhotoBoothRepository },
        {
          provide: HiddenBoothRepository,
          useClass: MockHiddenPhotoBoothRepository,
        },
        { provide: BrandService, useClass: MockBrandService },
      ],
    }).compile();

    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);
    photoBoothRepository =
      module.get<PhotoBoothRepository>(PhotoBoothRepository);
    photoBoothHiddenRepository = module.get<HiddenBoothRepository>(
      HiddenBoothRepository,
    );
    brandService = module.get<BrandService>(BrandService);

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
          return Promise.resolve([[savedPhotoBooth], 0]);
        }
      });

    jest
      .spyOn(photoBoothRepository, 'findOneBooth')
      .mockImplementation((booth: PhotoBooth) => {
        const savePhotoBooth = new PhotoBooth();

        if (booth.id === 'uuid') {
          savePhotoBooth.id = 'uuid';
          return Promise.resolve(savePhotoBooth);
        } else {
          return Promise.reject(new NotFoundException('EntityNotFoundError'));
        }
      });

    jest
      .spyOn(photoBoothHiddenRepository, 'findOneHiddenBooth')
      .mockImplementation((booth: HiddenPhotoBooth) => {
        if (booth.id === 'hiddenId') {
          return Promise.resolve(booth);
        } else if (booth.id === 'uuid') {
          return Promise.resolve(booth);
        } else {
          return Promise.reject(new NotFoundException('EntityNotFoundError'));
        }
      });

    jest
      .spyOn(photoBoothRepository, 'remove')
      .mockImplementation((booth: PhotoBooth) => {
        return Promise.resolve(booth);
      });

    jest
      .spyOn(photoBoothRepository, 'save')
      .mockImplementation((booth: PhotoBooth) => {
        return Promise.resolve(booth);
      });

    jest
      .spyOn(photoBoothHiddenRepository, 'save')
      .mockImplementation((booth: HiddenPhotoBooth) => {
        return Promise.resolve(booth);
      });

    jest
      .spyOn(brandService, 'findOneBrandBy')
      .mockImplementation((brand: PhotoBoothBrand) => {
        if (brand.name === '업체명') {
          return Promise.resolve(brand);
        } else {
          return Promise.reject(new NotFoundException('EntityNotFoundError'));
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
    expect(brandService).toBeDefined();
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

      const [photoBoothsInDb, countInDb] =
        await photoBoothRepository.findBoothByOptionAndCount(booth, pageProps);

      // When
      const [result, resultCount] =
        await photoBoothService.findOpenBoothByQueryParam(pageProps, booth);

      // Then
      expect(resultCount).toEqual(countInDb);
      expect(result).toEqual(photoBoothsInDb);
    });

    it('SUCCESS: 쿼리 조건을 추가하지 않으면 전체 목록 반환', async () => {
      // Given
      const booth = new PhotoBooth();

      const [photoBoothsInDb, countInDb] =
        await photoBoothRepository.findBoothByOptionAndCount(booth, pageProps);

      // When
      const [result, resultCount] =
        await photoBoothService.findOpenBoothByQueryParam(pageProps, booth);

      // Then
      expect(resultCount).toEqual(countInDb);
      expect(result).toEqual(photoBoothsInDb);
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
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('updateOpenBooth()', () => {
    const updateProps: ToBoothProps = {
      longitude: 0,
      latitude: 0,
      name: '포토부스 이름',
      location: '지역',
      streetAddress: '지번 주소',
      roadAddress: '도로명 주소',
      brandName: '업체명',
      operationTime: 'string',
    };
    it('SUCCESS: uuid 값이 존재할 때 전달 받은 정보로 업데이트 (boolean)', async () => {
      // Given
      const id = 'uuid';
      const photoBoothBrand = await brandService.findOneBrandBy(
        PhotoBoothBrand.byName(updateProps.brandName),
      );

      const savedBooth = await photoBoothRepository.save({
        id,
        photoBoothBrand,
        ...updateProps,
      });

      // When
      const result = await photoBoothService.updateOpenBooth(id, updateProps);

      // Then
      expect(result).toEqual(savedBooth);
    });

    it('FAILURE: 수정할 속성에 업체명이 존재하지 않을 때 404 에러', async () => {
      // Given
      const id = 'uuid';
      updateProps.brandName = '없는 업체명';

      // When & Then
      expect(async () => {
        await photoBoothService.updateOpenBooth(id, updateProps);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBoothId = 'not uuid';
      updateProps.brandName = '업체명';

      // When & Then
      expect(async () => {
        await photoBoothService.updateOpenBooth(notBoothId, updateProps);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('deleteOpenBooth()', () => {
    it('SUCCESS: uuid 값이 존재할 때 해당 id의 포토부스 지점을 삭제하고 hiddenBooth로 이동', async () => {
      // Given
      const id = 'uuid';

      const booth = await photoBoothRepository.findOneBooth(
        PhotoBooth.byId(id),
      );

      // When
      const result = await photoBoothService.deleteOpenBooth(id);

      // Then
      expect(result).toEqual(booth);
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBoothId = 'not uuid';

      // When & Then
      expect(async () => {
        await photoBoothService.deleteOpenBooth(notBoothId);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('updateHiddenBooth()', () => {
    const updateProps: ToBoothProps = {
      longitude: 0,
      latitude: 0,
      name: '포토부스 이름',
      location: '지역',
      streetAddress: '지번 주소',
      roadAddress: '도로명 주소',
      brandName: '업체명',
      operationTime: 'string',
    };
    it('SUCCESS: uuid 값이 존재할 때 전달 받은 정보로 업데이트 ', async () => {
      // Given
      const id = 'uuid';
      const savedBooth = await photoBoothHiddenRepository.save({
        id,
        ...updateProps,
      });
      // When
      const result = await photoBoothService.updateHiddenBooth(id, updateProps);

      // Then
      expect(result).toEqual(savedBooth);
    });

    it('FAILURE: uuid 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBoothId = 'not uuid';

      // When & Then
      expect(async () => {
        await photoBoothService.updateHiddenBooth(notBoothId, updateProps);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
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
    };

    it('SUCCESS: 비공개 포토부스에서 공개포토부스로 이동', async () => {
      // Given
      const id = 'hiddenId';

      const photoBoothBrand = await brandService.findOneBrandBy(
        PhotoBoothBrand.byName(photoBoothUpdateProps.brandName),
      );
      const savedBooth = await photoBoothRepository.save({
        id,
        photoBoothBrand,
        ...photoBoothUpdateProps,
      });

      // When
      const result = await photoBoothService.moveHiddenToOpenBooth(
        id,
        photoBoothUpdateProps,
      );

      // Then
      expect(result).toEqual(savedBooth);
    });

    it('FAILURE: 비공개 포토부스에 업체명이 존재하지 않을 때 404 에러', async () => {
      // Given
      const id = 'hiddenId';
      photoBoothUpdateProps.brandName = '업체명이 없을 때';

      // When & Then
      expect(async () => {
        await photoBoothService.moveHiddenToOpenBooth(
          id,
          photoBoothUpdateProps,
        );
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });
});
