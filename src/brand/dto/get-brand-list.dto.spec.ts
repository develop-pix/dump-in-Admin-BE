import { plainToInstance } from 'class-transformer';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';
import { PhotoBoothBrand } from '../entity/brand.entity';
import { GetBrandList } from './get-brand-list.dto';
import { BrandReqBody } from './req-brand-body.dto';

describe('GetBrandList', () => {
  let getBrandList: GetBrandList;
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

    getBrandList = new GetBrandList(data);
  });

  it('should be defined', () => {
    expect(getBrandList).toBeDefined();
  });

  it('SUCCESS: PhotoBoothBrand 엔티티로 GetBrandList DTO 생성', () => {
    expect(getBrandList.id).toEqual(data.id);
    expect(getBrandList.name).toEqual(data.name);
    expect(getBrandList.isEvent).toEqual(data.isEvent);
    expect(getBrandList.mainThumbnailImageUrl).toEqual(
      data.mainThumbnailImageUrl,
    );
    expect(getBrandList.mainThumbnailImageUrl).toEqual(
      data.mainThumbnailImageUrl,
    );
    expect(getBrandList.hashtags).toEqual(brandReqBody.hashtags);
  });
});
