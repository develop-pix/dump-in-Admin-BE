import { PhotoBoothReqBody } from './req-photo-booth-body.dto';

describe('PhotoBoothReqBody', () => {
  let photoBoothReqBody: PhotoBoothReqBody;

  beforeEach(() => {
    photoBoothReqBody = new PhotoBoothReqBody();
  });

  it('should create an instance', () => {
    expect(photoBoothReqBody).toBeDefined();
  });

  it('should have the correct properties', () => {
    expect(photoBoothReqBody.name).toBeUndefined();
    expect(photoBoothReqBody.location).toBeUndefined();
    expect(photoBoothReqBody.latitude).toBeUndefined();
    expect(photoBoothReqBody.longitude).toBeUndefined();
    expect(photoBoothReqBody.streetAddress).toBeUndefined();
    expect(photoBoothReqBody.roadAddress).toBeUndefined();
    expect(photoBoothReqBody.operationTime).toBeUndefined();
    expect(photoBoothReqBody.brandName).toBeUndefined();
  });

  it('should return the correct entity', () => {
    const expectedEntity = {
      name: '하루필름 홍대 1호점',
      location: '서울',
      latitude: 37.566295,
      longitude: 126.977945,
      streetAddress: '...',
      roadAddress: '...',
      operationTime: '...',
      brandName: '...',
    };

    photoBoothReqBody.name = '하루필름 홍대 1호점';
    photoBoothReqBody.location = '서울';
    photoBoothReqBody.latitude = 37.566295;
    photoBoothReqBody.longitude = 126.977945;
    photoBoothReqBody.streetAddress = '...';
    photoBoothReqBody.roadAddress = '...';
    photoBoothReqBody.operationTime = '...';
    photoBoothReqBody.brandName = '...';

    const entity = photoBoothReqBody.toEntity();

    expect(entity).toEqual(expectedEntity);
  });
});
