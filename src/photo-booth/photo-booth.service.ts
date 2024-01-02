import { ConflictException, Injectable } from '@nestjs/common';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { PhotoBooth } from './entity/photo-booth.entity';
import { PaginationProps } from 'src/common/dto/get-pagination-query.dto';
import {
  FindBoothOptionProps,
  FindBrandOptionProps,
} from './dto/get-photo-booth-query.dto';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import {
  BrandUpdateProps,
  PhotoBoothUpdateProps,
} from './dto/patch-photo-booth.dto';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';
import { PhotoBoothBrand } from './entity/photo-booth-brand.entity';
import { MoveToOpenBoothProps } from './dto/put-photo-booth.dto';
import { HashtagService } from '../hashtag/hashtag.service';
import { BrandCreateProps } from './dto/post-photo-booth.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { BrandHashtag } from '../hashtag/entity/brand-hashtag.entity';
import { Hashtag } from '../hashtag/entity/hashtag.entity';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly hiddenBoothRepository: HiddenBoothRepository,
    private readonly photoBoothBrandRepository: PhotoBoothBrandRepository,
  ) {}

  /**
   * @param pageProps - Pagination (항목수, 페이지)
   * @param query - Request Query (지점명, 지역)
   * @desc - 쿼리 파라미터에 맞는 포토부스 데이터 반환
   *       - 쿼리 옵션이 없으면 전체 포토부스 데이터 반환
   */
  findOpenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<[PhotoBooth[], number]> {
    return this.photoBoothRepository.findBoothByOptionAndCount(
      PhotoBooth.of(query),
      pageProps,
    );
  }

  /**
   * @param id - 공개 포토부스의 uuid값
   * @desc 포토부스 지점에 대한 상세 데이터 반환
   */
  async findOneOpenBooth(id: string): Promise<PhotoBooth> {
    const photoBooth = await this.photoBoothRepository.findOneBooth(
      PhotoBooth.byId(id),
    );
    return ResponseEntity.validate('포토부스', photoBooth, id);
  }

  /**
   * @param id - 공개 포토부스의 uuid값
   * @param updateProps - 수정이 필요한 데이터 일부 (지역, 지점명, 주소)
   * @desc 포토부스 지점에 대한 데이터 수정
   */
  async updateOpenBooth(
    id: string,
    updateProps: PhotoBoothUpdateProps,
  ): Promise<boolean> {
    await this.findOneOpenBooth(id);
    const photoBoothBrand = await this.findOneBrandBy({
      name: updateProps.brandName,
    });

    await this.photoBoothRepository.save({
      id,
      photoBoothBrand,
      ...updateProps,
    });

    return true;
  }

  /**
   * @param id - uuid값
   * @desc 해당 id의 포토부스 지점을 삭제하고 hiddenBooth로 업데이트
   */
  async deleteOpenBooth(id: string): Promise<boolean> {
    const booth = await this.findOneOpenBooth(id);

    await this.deleteHiddenBooth(id);
    await this.photoBoothRepository.remove(booth);

    return true;
  }

  /**
   * @param pageProps - pagination (항목수, 페이지)
   * @param query - Request Query (지점명, 지역)
   * @desc - 쿼리 파라미터에 맞는 공개되지 않은 포토부스 데이터 반환
   *       - 쿼리 옵션이 없으면 공개되지 않은 전체 포토부스 데이터 반환
   */
  findHiddenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<[HiddenPhotoBooth[], number]> {
    return this.hiddenBoothRepository.findHiddenBoothByOptionAndCount(
      HiddenPhotoBooth.of(query),
      pageProps,
    );
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @desc 공개되지 않은 포토부스에 대한 디테일 데이터 반환
   */
  async findOneHiddenBooth(id: string): Promise<HiddenPhotoBooth> {
    const hiddenBooth = await this.hiddenBoothRepository.findOneHiddenBooth(
      HiddenPhotoBooth.byId(id),
    );
    return ResponseEntity.validate('비공개 포토부스', hiddenBooth, id);
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @param updateProps - 수정이 필요한 데이터 일부 - 지역, 지점명, 주소
   * @desc 공개되지 않은 포토부스 지점에 대한 데이터 수정
   */
  async updateHiddenBooth(
    id: string,
    updateProps: PhotoBoothUpdateProps,
  ): Promise<boolean> {
    await this.findOneHiddenBooth(id);
    await this.hiddenBoothRepository.save({
      id,
      ...updateProps,
    });

    return true;
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @param moveProps - 비공개 포토부스에서 공개 포토부스로 이동 시킬때 필요한 속성
   * @desc - 공개 포토부스에 id가 존재하면 예외처리
   *       - 브랜드 엔티티에서 업체명이 있으면 해당 업체명으로 업데이트
   *       - 공개 포토부스로 최종 이동
   */
  async moveHiddenToOpenBooth(
    id: string,
    moveProps: MoveToOpenBoothProps,
  ): Promise<boolean> {
    const isPhotoBoothExist = this.photoBoothRepository.hasId(
      PhotoBooth.byId(id),
    );

    if (isPhotoBoothExist) {
      throw new ConflictException('이미 포토부스가 존재합니다.');
    }

    const photoBoothBrand = await this.findOneBrandBy({
      name: moveProps.brandName,
    });

    await this.deleteHiddenBooth(id);
    await this.photoBoothRepository.save({ id, photoBoothBrand, ...moveProps });

    return true;
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @desc uuid 값을 가진 비공개 포토부스를 찾아서 삭제 처리 (soft)
   */
  async deleteHiddenBooth(id: string): Promise<boolean> {
    await this.findOneHiddenBooth(id);
    await this.hiddenBoothRepository.save({ id, preprocessedAt: new Date() });

    return true;
  }

  /**
   * @param pageProps - pagination (항목수, 페이지)
   * @param query - request query string (업체명, 이벤트 허용 여부)
   * @desc - 쿼리 파라미터에 맞는 포토부스 업체 반환
   *       - 쿼리 옵션이 없으면 전체 포토부스 업체 반환
   */
  async findBrandByQueryParam(
    pageProps: PaginationProps,
    query: FindBrandOptionProps,
  ): Promise<[PhotoBoothBrand[], number]> {
    return this.photoBoothBrandRepository.findBrandByOptionAndCount(
      PhotoBoothBrand.of(query),
      pageProps,
    );
  }

  /**
   * @param props - 포토부스 업체의 id, 이름
   * @desc 포토부스 업체명으로 업체에 대한 엔티티 반환
   */
  findOneBrandBy(props: FindBrandOptionProps): Promise<PhotoBoothBrand> {
    // const findBrand = await this.photoBoothBrandRepository.findOneBrand(
    //   PhotoBoothBrand.of(props),
    // );
    return this.photoBoothBrandRepository.findOneBrand(
      PhotoBoothBrand.of(props),
    );
  }

  /**
   * @param createProps - 브랜드 생성 속성들
   * @desc - 해시태그 생성
   *       - 브랜드 생성
   *       - 해시태그와 브랜드 연결
   *       - 이벤트 여부, 업체명, 대표이미지, 해시태그들
   */
  async createBrandWithHastags(
    createProps: BrandCreateProps,
  ): Promise<boolean> {
    const brandHashtags = await this.brandHashtags(createProps.hashtags);

    await this.photoBoothBrandRepository.save({
      brandHashtags,
      ...createProps,
    });

    return true;
  }

  /**
   * @param id          - 포토부스 업체에 대한 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 포토부스 업체의 이름, 설명, 업체 홈페이지 url, 해시태그, 대표이미지 수정
   *       - 업체명, 설명, 홈페이지 주소, 대표이미지, 이벤트 여부, 해시태그
   *       - 포토부스 업체 이미지를 여러장 수정
   */
  async updateBrandWithHastags(
    id: number,
    updateProps: BrandUpdateProps,
  ): Promise<boolean> {
    await this.findOneBrandBy({ id });

    const brandHashtags = await this.brandHashtags(updateProps.hashtags);

    await this.photoBoothBrandRepository.save({
      id,
      brandHashtags,
      ...updateProps,
    });

    return true;
  }

  /**
   * @param hashtags - 포토부스 업체의 생성 및 수정에 필요한 해시태그 엔티티
   * @desc  - 포토부스 업체관련 해시태그 가져오기
   */
  private async brandHashtags(hashtags: Hashtag[]): Promise<BrandHashtag[]> {
    const createdHashtags = await this.hashtagService.createHashtags(hashtags);
    return createdHashtags.map((hashtag) => BrandHashtag.create(hashtag));
  }
}
