import { Injectable } from '@nestjs/common';
import { BrandRepository } from './repository/brand.repository';
import { HashtagService } from '../hashtag/hashtag.service';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { PhotoBoothBrand } from './entity/brand.entity';
import { FindBrandOptionProps, ToBrandProps } from './brand.interface';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly hashtagService: HashtagService,
  ) {}

  /**
   * @param pageProps - pagination (항목수, 페이지)
   * @param query - request query string (업체명, 이벤트 허용 여부)
   * @desc - 쿼리 파라미터에 맞는 포토부스 업체 반환
   *       - 쿼리 옵션이 없으면 전체 포토부스 업체 반환
   */
  findBrandByQueryParam(
    pageProps: PaginationProps,
    query: FindBrandOptionProps,
  ): Promise<[PhotoBoothBrand[], number]> {
    return this.brandRepository.findBrandByOptionAndCount(
      PhotoBoothBrand.of(query),
      pageProps,
    );
  }

  /**
   * @param id - 포토부스 업체의 id, 이름
   * @desc 포토부스 업체 고유 아이디로 업체에 대한 엔티티 반환
   * @throws 존재하지 않는 포토부스 업체 (EntityNotFoundError)
   */
  findOneBrandById(id: number): Promise<PhotoBoothBrand> {
    return this.brandRepository.findOneBrand(PhotoBoothBrand.byId(id));
  }

  /**
   * @param brand - 포토부스 업체의 아이디, 이름을 변환한 엔티티
   * @desc 포토부스 업체명으로 업체에 대한 엔티티 반환
   * @throws 존재하지 않는 포토부스 업체 (EntityNotFoundError)
   */
  findOneBrandBy(brand: PhotoBoothBrand): Promise<PhotoBoothBrand> {
    return this.brandRepository.findOneBrand(brand);
  }

  /**
   * @param createProps - 브랜드 생성 속성들
   * @desc - 해시태그 생성
   *       - 브랜드 생성
   *       - 해시태그와 브랜드 연결
   *       - 이벤트 여부, 업체명, 대표이미지, 해시태그들
   */
  async createBrandWithHastags(
    createProps: ToBrandProps,
  ): Promise<PhotoBoothBrand> {
    const brandHashtags = await this.hashtagService.brandHashtags(
      createProps.hashtags,
    );
    return this.brandRepository.save({
      brandHashtags,
      ...createProps,
    });
  }

  /**
   * @param id - 포토부스 업체에 대한 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 포토부스 업체의 이름, 설명, 업체 홈페이지 url, 해시태그, 대표이미지 수정
   *       - 업체명, 설명, 홈페이지 주소, 대표이미지, 이벤트 여부, 해시태그
   *       - 포토부스 업체 이미지를 여러장 수정
   */
  async updateBrandWithHastags(
    id: number,
    updateProps: ToBrandProps,
  ): Promise<PhotoBoothBrand> {
    await this.findOneBrandById(id);
    const brandHashtags = await this.hashtagService.brandHashtags(
      updateProps.hashtags,
    );
    return this.brandRepository.save({
      id,
      brandHashtags,
      ...updateProps,
    });
  }
}
