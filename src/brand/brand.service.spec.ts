import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { BrandRepository } from './repository/brand.repository';
import { HashtagService } from '../hashtag/hashtag.service';
import { PhotoBoothBrand } from './entity/brand.entity';
import { Hashtag } from '../hashtag/entity/hashtag.entity';
import { NotFoundException } from '@nestjs/common';
import { ToBrandProps } from './brand.interface';
import { BrandImage } from './entity/brand-image.entity';
import { BrandHashtag } from '../hashtag/entity/brand-hashtag.entity';

class MockBrandRepository {
  findBrandByOptionAndCount = jest.fn();
  findOneBrand = jest.fn();
  save = jest.fn();
}

class MockHashtagService {
  createHashtags = jest.fn();
  brandHashtags = jest.fn();
}

describe('BrandService', () => {
  let brandRepository: BrandRepository;
  let hashtagService: HashtagService;
  let brandService: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        { provide: HashtagService, useClass: MockHashtagService },
        {
          provide: BrandRepository,
          useClass: MockBrandRepository,
        },
      ],
    }).compile();

    hashtagService = module.get<HashtagService>(HashtagService);
    brandService = module.get<BrandService>(BrandService);
    brandRepository = module.get<BrandRepository>(BrandRepository);

    jest
      .spyOn(brandRepository, 'findBrandByOptionAndCount')
      .mockImplementation((brand: PhotoBoothBrand) => {
        if (brand.name === '업체명') {
          const saveBrand = new PhotoBoothBrand();
          saveBrand.name = '업체명';
          return Promise.resolve([[saveBrand], 1]);
        } else {
          const saveBrand = new PhotoBoothBrand();
          return Promise.resolve([[saveBrand], 0]);
        }
      });

    jest
      .spyOn(brandRepository, 'findOneBrand')
      .mockImplementation((brand: PhotoBoothBrand) => {
        const saveBrand = new PhotoBoothBrand();

        if (brand.name === '업체명') {
          saveBrand.name = '업체명';
          return Promise.resolve(saveBrand);
        } else if (brand.id === 1) {
          saveBrand.id = 1;
          return Promise.resolve(saveBrand);
        } else {
          return Promise.reject(new NotFoundException('EntityNotFoundError'));
        }
      });

    jest
      .spyOn(brandRepository, 'save')
      .mockImplementation((brand: PhotoBoothBrand) => {
        return Promise.resolve(brand);
      });

    jest
      .spyOn(hashtagService, 'createHashtags')
      .mockImplementation((hashtags: Hashtag[]) => {
        return Promise.resolve(hashtags);
      });

    jest
      .spyOn(hashtagService, 'brandHashtags')
      .mockImplementation((hashtags: Hashtag[]) => {
        return Promise.resolve(
          hashtags.map((hashtag) => BrandHashtag.create(hashtag)),
        );
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(brandRepository).toBeDefined();
    expect(hashtagService).toBeDefined();
    expect(brandService).toBeDefined();
  });

  describe('findBrandByQueryParam()', () => {
    const pageProps = {
      take: 10,
      skip: 1,
      page: 1,
    };

    it('SUCCESS: 지역이나 이름으로 쿼리하면 데이터 반환', async () => {
      // Given
      const brand = new PhotoBoothBrand();
      brand.name = '업체명';

      const [photoBoothsInDb, countInDb] =
        await brandRepository.findBrandByOptionAndCount(brand, pageProps);

      // When
      const [result, resultCount] = await brandService.findBrandByQueryParam(
        pageProps,
        brand,
      );

      // Then
      expect(result).toEqual(photoBoothsInDb);
      expect(countInDb).toEqual(resultCount);
    });

    it('SUCCESS: 지역이나 이름으로 넣지 않으면 전체 데이터 반환', async () => {
      // Given
      const brand = new PhotoBoothBrand();

      const [photoBoothsInDb, countInDb] =
        await brandRepository.findBrandByOptionAndCount(brand, pageProps);

      // When
      const [result, resultCount] = await brandService.findBrandByQueryParam(
        pageProps,
        brand,
      );

      // Then
      expect(result).toEqual(photoBoothsInDb);
      expect(countInDb).toEqual(resultCount);
    });
  });

  describe('findOneBrandById', () => {
    it('SUCCESS: id 값이 존재할 때 데이터 반환', async () => {
      // Given
      const id = 1;

      const brandInDb = brandRepository.findOneBrand(PhotoBoothBrand.byId(id));

      // When
      const result = brandService.findOneBrandById(id);

      // Then
      expect(result).toEqual(brandInDb);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBrandId = 33333333;

      // When & Then
      expect(async () => {
        await brandService.findOneBrandById(notBrandId);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('findOneBrandBy', () => {
    it('SUCCESS: 업체명이 존재할 때 데이터 반환', async () => {
      // Given
      const name = '업체명';

      const brandInDb = brandRepository.findOneBrand(
        PhotoBoothBrand.byName(name),
      );

      // When
      const result = brandService.findOneBrandBy(PhotoBoothBrand.byName(name));

      // Then
      expect(result).toEqual(brandInDb);
    });

    it('FAILURE: 업체명이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBrandName = '없는 업체명';

      // When & Then
      expect(async () => {
        await brandService.findOneBrandBy(PhotoBoothBrand.byName(notBrandName));
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('createBrandWithHastags', () => {
    const createProps: ToBrandProps = {
      name: 'string',
      isEvent: true,
      description: 'string',
      photoBoothUrl: 'string',
      mainThumbnailImageUrl: 'string',
      hashtags: Hashtag.unique([
        '캐릭터',
        '콜라보',
        '연예인',
        '스냅',
        '이달의프레임',
      ]),
      images: ['url1', 'url2', 'url3'].map((image) => BrandImage.create(image)),
    };

    it('SUCCESS: 전달 받은 정보로 포토부스 업체 생성', async () => {
      // Given
      const brandHashtags = await hashtagService.brandHashtags(
        createProps.hashtags,
      );
      const expectedResult = await brandRepository.save({
        brandHashtags,
        ...createProps,
      });

      // When
      const result = await brandService.createBrandWithHastags(createProps);

      // Then
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateBrandWithHastags', () => {
    const updateProps: ToBrandProps = {
      name: 'string',
      isEvent: undefined,
      description: undefined,
      photoBoothUrl: undefined,
      mainThumbnailImageUrl: 'string',
      hashtags: Hashtag.unique(['스냅', '이달의프레임']),
      images: ['url1', 'url2', 'url3'].map((image) => BrandImage.create(image)),
    };

    it('SUCCESS: id 값이 존재할 때 전달 받은 정보로 업데이트', async () => {
      // Given
      const id = 1;
      const brandHashtags = await hashtagService.brandHashtags(
        updateProps.hashtags,
      );
      const expectedResult = await brandRepository.save({
        id,
        brandHashtags,
        ...updateProps,
      });

      // When
      const result = await brandService.updateBrandWithHastags(id, updateProps);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notBrandId = 222222;

      // When & Then
      expect(async () => {
        await brandService.updateBrandWithHastags(notBrandId, updateProps);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });
});
