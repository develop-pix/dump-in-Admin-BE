import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import {
  GetBoothBrandListDto,
  GetPhotoBoothListDto,
} from './dto/get-photo-booth-list.dto';
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
import { BrandImage } from './entity/photo-booth-brand-image.entity';
import { BrandHashtag } from '../hashtag/entity/brand-hashtag.entity';

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
  async findOpenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<[GetPhotoBoothListDto[], number]> {
    const [results, count] =
      await this.photoBoothRepository.findBoothByOptionAndCount(
        PhotoBooth.of(query),
        pageProps,
      );

    if (count === 0) {
      throw new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다.');
    }

    return [
      results.map((result: PhotoBooth) => new GetPhotoBoothListDto(result)),
      count,
    ];
  }

  /**
   * @param id - 공개 포토부스의 uuid값
   * @desc 포토부스 지점에 대한 상세 데이터 반환
   */
  async findOneOpenBooth(id: string): Promise<PhotoBooth> {
    const photoBooth = await this.photoBoothRepository.findOneBooth(
      PhotoBooth.byId(id),
    );

    if (!photoBooth) {
      throw new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다.');
    }

    return photoBooth;
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
    const isExistBooth = this.photoBoothRepository.hasId(PhotoBooth.byId(id));
    const photoBoothBrand = await this.findOneBrandByName(
      updateProps.brandName,
    );

    if (!isExistBooth) {
      throw new NotFoundException('포토부스를 찾지 못했습니다.');
    }

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
    const boothId = PhotoBooth.byId(id);
    const isExistBooth = this.photoBoothRepository.hasId(boothId);

    if (!isExistBooth) {
      throw new NotFoundException('포토부스를 찾지 못했습니다.');
    }

    await this.deleteHiddenBooth(id);
    await this.photoBoothRepository.remove(boothId);

    return true;
  }

  /**
   * @param pageProps - pagination (항목수, 페이지)
   * @param query - Request Query (지점명, 지역)
   * @desc - 쿼리 파라미터에 맞는 공개되지 않은 포토부스 데이터 반환
   *       - 쿼리 옵션이 없으면 공개되지 않은 전체 포토부스 데이터 반환
   */
  async findHiddenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<[GetPhotoBoothListDto[], number]> {
    const [results, count] =
      await this.hiddenBoothRepository.findHiddenBoothByOptionAndCount(
        HiddenPhotoBooth.of(query),
        pageProps,
      );

    if (count === 0) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점 목록을 찾지 못했습니다.',
      );
    }

    return [
      results.map(
        (result: HiddenPhotoBooth) => new GetPhotoBoothListDto(result),
      ),
      count,
    ];
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @desc 공개되지 않은 포토부스에 대한 디테일 데이터 반환
   */
  async findOneHiddenBooth(id: string): Promise<HiddenPhotoBooth> {
    const hiddenBooth = await this.hiddenBoothRepository.findOneHiddenBooth(
      HiddenPhotoBooth.byId(id),
    );

    if (!hiddenBooth) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점을 찾지 못했습니다.',
      );
    }

    return hiddenBooth;
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
    const isExistHiddenBooth = this.hiddenBoothRepository.hasId(
      HiddenPhotoBooth.byId(id),
    );

    if (!isExistHiddenBooth) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점을 찾지 못했습니다.',
      );
    }

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

    const photoBoothBrand = await this.findOneBrandByName(moveProps.brandName);

    await Promise.all([
      this.photoBoothRepository.save({ id, photoBoothBrand, ...moveProps }),
      this.deleteHiddenBooth(id),
    ]);

    return true;
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @desc uuid 값을 가진 비공개 포토부스를 찾아서 삭제 처리 (soft)
   */
  async deleteHiddenBooth(id: string): Promise<boolean> {
    const isHiddenBoothExist = this.hiddenBoothRepository.hasId(
      HiddenPhotoBooth.byId(id),
    );

    if (!isHiddenBoothExist) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점을 찾지 못했습니다.',
      );
    }

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
  ): Promise<[GetBoothBrandListDto[], number]> {
    const [results, count] =
      await this.photoBoothBrandRepository.findBrandByOptionAndCount(
        PhotoBoothBrand.of(query),
        pageProps,
      );

    if (count === 0) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다.');
    }

    return [
      results.map(
        (entity: PhotoBoothBrand) => new GetBoothBrandListDto(entity),
      ),
      count,
    ];
  }

  /**
   * @param id - 포토부스 업체의 id
   * @desc 포토부스 업체에 대한 상세 데이터 반환
   */
  async findOneBrandById(id: number): Promise<PhotoBoothBrand> {
    const photoBoothBrand = await this.photoBoothBrandRepository.findOneBrand(
      PhotoBoothBrand.byId(id),
    );

    if (!photoBoothBrand) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다.');
    }

    return photoBoothBrand;
  }

  /**
   * @param name - 포토부스 업체의 이름
   * @desc 포토부스 업체명으로 업체에 대한 엔티티 반환
   */
  async findOneBrandByName(name: string): Promise<PhotoBoothBrand> {
    if (typeof name === 'undefined') return undefined;

    const photoBoothBrand = await this.photoBoothBrandRepository.findOneBrand(
      PhotoBoothBrand.byName(name),
    );

    if (!photoBoothBrand) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다.');
    }

    return photoBoothBrand;
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
    const [brandHashtags, brandImages] =
      await this.prepareBrandAttributes(createProps);

    await this.photoBoothBrandRepository.save({
      brandImages,
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
    const brandId = PhotoBoothBrand.byId(id);
    const isExistBrand = this.photoBoothBrandRepository.hasId(brandId);

    if (!isExistBrand) {
      throw new NotFoundException('업데이트할 포토부스 업체가 없습니다.');
    }

    const [brandHashtags, brandImages] =
      await this.prepareBrandAttributes(updateProps);

    await this.photoBoothBrandRepository.save({
      id,
      brandImages,
      brandHashtags,
      ...updateProps,
    });

    return true;
  }

  /**
   * @param props - 브랜드 생성 및 수정에 필요한 속성들
   * @desc  - 브랜드 관련 업체명 가져오기
   *        - 브랜드 관련 해시태그 가져오기
   *        - 브랜드 이미지 엔티티에 브랜드 이미지를 삽입
   */
  private async prepareBrandAttributes(
    props: BrandCreateProps | BrandUpdateProps,
  ): Promise<[BrandImage[], BrandHashtag[]]> {
    const hashtags = await this.hashtagService.createHashtags(props.hashtags);

    return Promise.all([
      props.images?.map((image) => BrandImage.create(image)),
      hashtags.length !== 0
        ? hashtags.map((hashtag) => BrandHashtag.create(hashtag))
        : undefined,
    ]);
  }
}
