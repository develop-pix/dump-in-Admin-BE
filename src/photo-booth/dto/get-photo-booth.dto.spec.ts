import { plainToInstance } from 'class-transformer';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { GetPhotoBoothList } from './get-photo-booth-list.dto';
import { PhotoBoothBrand } from '../../brand/entity/brand.entity';
import { GetPhotoBoothDetail } from './get-photo-booth-detail.dto';

describe('GetPhotoBoothList', () => {
  let mockPhotoBoothData: PhotoBooth;

  beforeEach(() => {
    const data = {
      id: 'uuid',
      name: '하루필름 홍대 1호점',
      location: '서울',
      latitude: 37.12345,
      longitude: 127.98765,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-02'),
      likeCount: 10,
      viewCount: 20,
      streetAddress: '지번 주소',
      roadAddress: '도로명 주소',
      operationTime: '영업 시간',
      photoBoothBrand: new PhotoBoothBrand(),
    };
    mockPhotoBoothData = plainToInstance(PhotoBooth, data);
  });

  it('should be defined', () => {
    expect(mockPhotoBoothData).toBeInstanceOf(PhotoBooth);
  });

  describe('GetPhotoBoothList', () => {
    it('SUCCESS: PhotoBooth 엔티티로 GetPhotoBoothList DTO 생성', () => {
      const getPhotoBoothList: GetPhotoBoothList = new GetPhotoBoothList(
        mockPhotoBoothData,
      );

      expect(getPhotoBoothList.id).toEqual(mockPhotoBoothData.id);
      expect(getPhotoBoothList.name).toEqual(mockPhotoBoothData.name);
      expect(getPhotoBoothList.location).toEqual(mockPhotoBoothData.location);
      expect(getPhotoBoothList.streetAddress).toEqual(
        mockPhotoBoothData.streetAddress,
      );
      expect(getPhotoBoothList.roadAddress).toEqual(
        mockPhotoBoothData.roadAddress,
      );
      expect(getPhotoBoothList.brandName).toEqual(
        mockPhotoBoothData.photoBoothBrand.name,
      );
    });
  });

  describe('GetPhotoBoothDetail', () => {
    it('SUCCESS: PhotoBooth 엔티티로 GetPhotoBoothDetail DTO 생성', () => {
      const getPhotoBoothDetail: GetPhotoBoothDetail = new GetPhotoBoothDetail(
        mockPhotoBoothData,
      );

      expect(getPhotoBoothDetail.id).toEqual(mockPhotoBoothData.id);
      expect(getPhotoBoothDetail.name).toEqual(mockPhotoBoothData.name);
      expect(getPhotoBoothDetail.location).toEqual(mockPhotoBoothData.location);
      expect(getPhotoBoothDetail.streetAddress).toEqual(
        mockPhotoBoothData.streetAddress,
      );
      expect(getPhotoBoothDetail.roadAddress).toEqual(
        mockPhotoBoothData.roadAddress,
      );
      expect(getPhotoBoothDetail.brandName).toEqual(
        mockPhotoBoothData.photoBoothBrand.name,
      );
      expect(getPhotoBoothDetail.latitude).toEqual(mockPhotoBoothData.latitude);
      expect(getPhotoBoothDetail.longitude).toEqual(
        mockPhotoBoothData.longitude,
      );
      expect(getPhotoBoothDetail.operationTime).toEqual(
        mockPhotoBoothData.operationTime,
      );
    });
  });
});
