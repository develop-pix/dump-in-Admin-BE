import { plainToInstance } from 'class-transformer';
import { PhotoBoothBrand } from '../entity/brand.entity';
import { GetBrandDetail } from './get-brand-detail.dto';
import { BrandReqBody } from './req-brand-body.dto';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';

describe('GetBrandDetail', () => {
  let getBrandDetail: GetBrandDetail;
  let brandReqBody: BrandReqBody;
  let data: PhotoBoothBrand;

  beforeEach(() => {
    brandReqBody = new BrandReqBody();
    brandReqBody.name = '포토그레이';
    brandReqBody.mainThumbnailImageUrl = 'https://example.com/image.jpg';
    brandReqBody.description = '포토부스 업체 설명';
    brandReqBody.photoBoothUrl = 'https://example.com';
    brandReqBody.isEvent = true;
    brandReqBody.hashtags = ['행사', '웨딩', '파티', '스냅'];
    brandReqBody.images = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ];

    const brandToEntity = brandReqBody.toEntity();
    data = plainToInstance(PhotoBoothBrand, {
      id: 1,
      brandHashtags: brandToEntity.hashtags.map((hashtag) =>
        BrandHashtag.create(hashtag),
      ),
      brandImages: brandToEntity.images,
      ...brandToEntity,
    });

    getBrandDetail = new GetBrandDetail(data);
  });

  it('should be defined', () => {
    expect(getBrandDetail).toBeDefined();
  });

  it('SUCCESS: PhotoBoothBrand 엔티티로 GetBrandDetail DTO 생성', () => {
    expect(getBrandDetail.description).toEqual(data.description);
    expect(getBrandDetail.photoBoothUrl).toEqual(data.photoBoothUrl);
    expect(getBrandDetail.isEvent).toEqual(data.isEvent);
    expect(getBrandDetail.images).toEqual(brandReqBody.images);
  });
});
