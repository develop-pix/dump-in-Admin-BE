import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { BrandImage } from '../entity/brand-image.entity';
import { BrandReqBody } from './req-brand-body.dto';

describe('BrandReqBody', () => {
  let brandReqBody: BrandReqBody;

  beforeEach(() => {
    brandReqBody = new BrandReqBody();
  });

  it('should be defined', () => {
    expect(brandReqBody).toBeDefined();
  });

  it('SUCCESS: toEntity() 속성 확인', () => {
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

    const entity = brandReqBody.toEntity();

    expect(entity.name).toEqual('포토그레이');
    expect(entity.mainThumbnailImageUrl).toEqual(
      'https://example.com/image.jpg',
    );
    expect(entity.description).toEqual('포토부스 업체 설명');
    expect(entity.photoBoothUrl).toEqual('https://example.com');
    expect(entity.isEvent).toEqual(true);
    expect(entity.hashtags).toEqual(
      Hashtag.unique(['행사', '웨딩', '파티', '스냅']),
    );
    expect(entity.images).toHaveLength(2);
    expect(entity.images[0]).toBeInstanceOf(BrandImage);
  });
});
