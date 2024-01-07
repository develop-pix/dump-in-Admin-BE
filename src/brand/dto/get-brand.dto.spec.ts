import { plainToInstance } from 'class-transformer';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';
import { PhotoBoothBrand } from '../entity/brand.entity';
import { GetBrandList } from './get-brand-list.dto';
import { BrandReqBody } from './req-brand-body.dto';
import { GetBrandDetail } from './get-brand-detail.dto';

describe('GetBrandDto', () => {
  let brandReqBody: BrandReqBody;
  let getBrandList: GetBrandList;
  let getBrandDetail: GetBrandDetail;
  let mockBrandData: PhotoBoothBrand;

  beforeEach(() => {
    brandReqBody = new BrandReqBody();
    brandReqBody.name = '포토그레이';
    brandReqBody.mainThumbnailImageUrl = 'https://example.com/image.jpg';
    brandReqBody.description = '포토부스 업체 설명';
    brandReqBody.photoBoothUrl = 'https://example.com';
    brandReqBody.isEvent = true;
    brandReqBody.hashtags = ['행사', '웨딩', '파티', '스냅'];
    brandReqBody.images = ['url', 'url2', 'url3', 'url4'];

    const brandToEntity = brandReqBody.toEntity();
    mockBrandData = plainToInstance(PhotoBoothBrand, {
      id: 1,
      brandHashtags: brandToEntity.hashtags.map((hashtag) =>
        BrandHashtag.create(hashtag),
      ),
      brandImages: brandToEntity.images,
      ...brandToEntity,
    });

    getBrandList = new GetBrandList(mockBrandData);
    getBrandDetail = new GetBrandDetail(mockBrandData);
  });

  it('should be defined', () => {
    expect(brandReqBody).toBeDefined();
    expect(getBrandList).toBeDefined();
    expect(getBrandDetail).toBeDefined();
    expect(mockBrandData).toBeInstanceOf(PhotoBoothBrand);
  });

  describe('GetBrandList', () => {
    it('SUCCESS: PhotoBoothBrand 엔티티로 GetBrandList DTO 생성', () => {
      expect(getBrandList.id).toEqual(mockBrandData.id);
      expect(getBrandList.name).toEqual(mockBrandData.name);
      expect(getBrandList.isEvent).toEqual(mockBrandData.isEvent);
      expect(getBrandList.mainThumbnailImageUrl).toEqual(
        mockBrandData.mainThumbnailImageUrl,
      );
      expect(getBrandList.mainThumbnailImageUrl).toEqual(
        mockBrandData.mainThumbnailImageUrl,
      );
      expect(getBrandList.hashtags).toEqual(
        mockBrandData.brandHashtags.map((hashtags) => hashtags.hashtag.name),
      );
    });
  });

  describe('GetBrandDetail', () => {
    it('SUCCESS: PhotoBoothBrand 엔티티로 GetBrandDetail DTO 생성', () => {
      expect(getBrandDetail.description).toEqual(mockBrandData.description);
      expect(getBrandDetail.photoBoothUrl).toEqual(mockBrandData.photoBoothUrl);
      expect(getBrandDetail.isEvent).toEqual(mockBrandData.isEvent);
      expect(getBrandDetail.images).toEqual(
        mockBrandData.brandImages.map((image) => image.brandImageUrl),
      );
    });
  });
});
