import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { GetBrandList } from './dto/get-brand-list.dto';
import { GetBrandDetail } from './dto/get-brand-detail.dto';
import { PhotoBoothBrand } from './entity/brand.entity';
import { BrandQueryParam } from './dto/req-brand-query.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { CreateBrand } from './dto/post-brand.dto';
import { UpdateBrand } from './dto/patch-brand.dto';
import { HttpStatus } from '@nestjs/common';

class MockBrandService {
  findBrandByQueryParam = jest.fn();
  createBrandWithHastags = jest.fn();
  findOneBrandById = jest.fn();
  updateBrandWithHastags = jest.fn();
}

describe('BrandController', () => {
  let brandController: BrandController;
  let brandService: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [{ provide: BrandService, useClass: MockBrandService }],
    }).compile();

    brandController = module.get<BrandController>(BrandController);
    brandService = module.get<BrandService>(BrandService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(brandController).toBeDefined();
    expect(brandService).toBeDefined();
  });

  describe('findBrandByQueryParam', () => {
    it('SUCCESS: 포토부스 업체 목록 반환', async () => {
      const mockResponse = [new PhotoBoothBrand()];
      const mockCount = 1;
      const mockRequest = new BrandQueryParam();

      jest
        .spyOn(brandService, 'findBrandByQueryParam')
        .mockResolvedValueOnce([mockResponse, mockCount]);

      const result = await brandController.findBrandByQueryParam(mockRequest);

      expect(brandService.findBrandByQueryParam).toHaveBeenCalledWith(
        mockRequest.getPageProps(),
        mockRequest.getQueryProps(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<PageEntity<GetBrandList>>(
          expect.any(String),
          expect.any(PageEntity<GetBrandList>),
        ),
      );
    });
  });

  describe('findOneBrand', () => {
    it('SUCCESS: 요청한 ID로 포토부스 업체 반환', async () => {
      const mockResponse = new PhotoBoothBrand();
      const mockId = 1;

      jest
        .spyOn(brandService, 'findOneBrandById')
        .mockResolvedValueOnce(mockResponse);

      const result = await brandController.findOneBrand(mockId);

      expect(brandService.findOneBrandById).toHaveBeenCalledWith(mockId);
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<GetBrandDetail>(
          expect.any(String),
          expect.any(GetBrandDetail),
        ),
      );
    });
  });

  describe('createBrand', () => {
    it('SUCCESS: 포토부스 업체 생성', async () => {
      const mockRequest = new CreateBrand();
      const mockResponse = new PhotoBoothBrand();
      mockRequest.toCreateEntity = jest.fn().mockReturnValue(mockResponse);

      jest
        .spyOn(brandService, 'createBrandWithHastags')
        .mockResolvedValue(mockResponse);

      const result = await brandController.createBrand(mockRequest);

      expect(brandService.createBrandWithHastags).toHaveBeenCalledWith(
        mockRequest.toCreateEntity(),
      );
      expect(result.code).toEqual(HttpStatus.CREATED);
      expect(result).toEqual(ResponseEntity.CREATED(expect.any(String)));
    });
  });

  describe('updateBrand', () => {
    it('SUCCESS: 포토부스 업체 수정', async () => {
      const mockId = 1;
      const mockRequest = new UpdateBrand();
      const mockResponse = new PhotoBoothBrand();
      mockRequest.toUpdateEntity = jest.fn().mockReturnValue(mockResponse);

      jest
        .spyOn(brandService, 'updateBrandWithHastags')
        .mockResolvedValue(mockResponse);

      const result = await brandController.updateBrand(mockId, mockRequest);

      expect(brandService.updateBrandWithHastags).toHaveBeenCalledWith(
        mockId,
        mockRequest.toUpdateEntity(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
    });
  });
});
