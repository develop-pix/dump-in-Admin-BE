import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { BrandImage } from '../entity/brand-image.entity';
import { BrandReqBody } from './req-brand-body.dto';

describe('BrandReqBody', () => {
  let brandReqBody: BrandReqBody;

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
  });

  it('should be defined', () => {
    expect(brandReqBody).toBeDefined();
  });

  it('SUCCESS: toEntity 속성 확인', () => {
    const entity = brandReqBody.toEntity();

    expect(entity.name).toEqual(brandReqBody.name);
    expect(entity.mainThumbnailImageUrl).toEqual(
      brandReqBody.mainThumbnailImageUrl,
    );
    expect(entity.description).toEqual(brandReqBody.description);
    expect(entity.photoBoothUrl).toEqual(brandReqBody.photoBoothUrl);
    expect(entity.isEvent).toEqual(brandReqBody.isEvent);
    expect(entity.hashtags).toEqual(Hashtag.unique(brandReqBody.hashtags));
    expect(entity.images).toHaveLength(2);
    expect(entity.images[0]).toBeInstanceOf(BrandImage);
  });
});
