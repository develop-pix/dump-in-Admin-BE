import {
  BadRequestException,
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
import { plainToInstance } from 'class-transformer';
import { BrandImage } from './entity/photo-booth-brand-image.entity';
import { BrandHashtag } from 'src/hashtag/entity/brand-hashtag.entity';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly hiddenBoothRepository: HiddenBoothRepository,
    private readonly photoBoothBrandRepository: PhotoBoothBrandRepository,
  ) {}

  async findOpenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<[GetPhotoBoothListDto[], number]> {
    /**
     * @param pageProps - pagination - skip, take
     * @param query - request query string - 지점명, 지역
     * @desc - 쿼리 파라미터에 맞는 포토부스 데이터 반환
     *       - 쿼리 옵션이 없으면 전체 포토부스 데이터 반환
     */

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

  async findOneOpenBooth(id: string): Promise<PhotoBooth> {
    /**
     * @param id - 공개 포토부스의 uuid값
     * @desc 포토부스 지점에 대한 상세 데이터 반환
     */

    const photoBooth = await this.photoBoothRepository.findOneBooth(
      PhotoBooth.byId(id),
    );

    if (!photoBooth) {
      throw new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다.');
    }

    return photoBooth;
  }

  async updateOpenBooth(
    id: string,
    updateProps: PhotoBoothUpdateProps,
  ): Promise<boolean> {
    /**
     * @param id - 공개 포토부스의 uuid값
     * @param updateProps - 수정이 필요한 데이터 일부 - 지역, 지점명, 주소
     * @desc 포토부스 지점에 대한 데이터 수정
     */

    const isExistBooth = this.photoBoothRepository.hasId(PhotoBooth.byId(id));
    const photoBoothBrand = await this.findOneBrandByName(
      updateProps.brandName,
    );

    if (!isExistBooth) {
      throw new NotFoundException('포토부스를 찾지 못했습니다.');
    }

    await this.photoBoothRepository.save(
      plainToInstance(PhotoBooth, { id, photoBoothBrand, ...updateProps }),
    );

    return true;
  }

  async deleteOpenBooth(id: string): Promise<boolean> {
    /**
     * @param id - uuid값
     * @desc - 해당 id의 포토부스 지점을 삭제하고 hiddenBooth로 업데이트
     */

    const boothId = PhotoBooth.byId(id);
    const isExistBooth = this.photoBoothRepository.hasId(boothId);

    if (!isExistBooth) {
      throw new NotFoundException('포토부스를 찾지 못했습니다.');
    }

    await this.deleteHiddenBooth(id);

    return true;
  }

  async findHiddenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<[GetPhotoBoothListDto[], number]> {
    /**
     * @param pageProps - pagination - 항목수, 페이지
     * @param query - request query string - 지점명, 지역
     * @desc - 쿼리 파라미터에 맞는 공개되지 않은 포토부스 데이터 반환
     *       - 쿼리 옵션이 없으면 공개되지 않은 전체 포토부스 데이터 반환
     */

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

  async findOneHiddenBooth(id: string): Promise<HiddenPhotoBooth> {
    /**
     * @param id - 비공개 포토부스의 uuid
     * @desc 공개되지 않은 포토부스에 대한 디테일 데이터 반환
     */

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

  async updateHiddenBooth(
    id: string,
    updateProps: PhotoBoothUpdateProps,
  ): Promise<boolean> {
    /**
     * @param id - 비공개 포토부스의 uuid
     * @param updateProps - 수정이 필요한 데이터 일부 - 지역, 지점명, 주소
     * @desc 공개되지 않은 포토부스 지점에 대한 데이터 수정
     */

    const isExistHiddenBooth = this.hiddenBoothRepository.hasId(
      HiddenPhotoBooth.byId(id),
    );

    if (!isExistHiddenBooth) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점을 찾지 못했습니다.',
      );
    }

    await this.hiddenBoothRepository.save(
      plainToInstance(HiddenPhotoBooth, {
        id,
        ...updateProps,
      }),
    );

    return true;
  }

  async moveHiddenToOpenBooth(
    id: string,
    moveProps: MoveToOpenBoothProps,
  ): Promise<boolean> {
    /**
     * @param id - 비공개 포토부스의 uuid
     * @param moveProps - 비공개 포토부스에서 공개 포토부스로 이동 시킬때 필요한 속성
     * @desc - 공개 포토부스에 id가 존재하면 예외처리
     *       - 브랜드 엔티티에서 업체명이 있으면 해당 업체명으로 업데이트
     *       - 공개 포토부스로 최종 이동
     */

    const isPhotoBoothExist = this.photoBoothRepository.hasId(
      PhotoBooth.byId(id),
    );
    const photoBoothBrand = await this.findOneBrandByName(moveProps.brandName);

    if (isPhotoBoothExist) {
      throw new BadRequestException('이미 포토부스가 존재합니다.');
    }

    await Promise.all([
      this.photoBoothRepository.save(
        plainToInstance(PhotoBooth, { id, photoBoothBrand, ...moveProps }),
      ),
      this.deleteHiddenBooth(id),
    ]);

    return true;
  }

  async deleteHiddenBooth(id: string): Promise<boolean> {
    /**
     * @param id - 비공개 포토부스의 uuid
     * @desc uuid 값을 가진 비공개 포토부스를 찾아서 삭제 처리 (soft)
     */
    const isHiddenBoothExist = this.hiddenBoothRepository.hasId(
      HiddenPhotoBooth.byId(id),
    );

    if (isHiddenBoothExist) {
      throw new BadRequestException('이미 포토부스가 존재합니다.');
    }

    await this.hiddenBoothRepository.save(
      plainToInstance(HiddenPhotoBooth, { id, preprocessedAt: new Date() }),
    );

    return true;
  }

  async findBrandByQueryParam(
    pageProps: PaginationProps,
    query: FindBrandOptionProps,
  ): Promise<[GetBoothBrandListDto[], number]> {
    /**
     * @param pageProps - pagination - 항목수, 페이지
     * @param query - request query string - 업체명, 이벤트 허용 여부
     * @desc - 쿼리 파라미터에 맞는 포토부스 업체 반환
     *       - 쿼리 옵션이 없으면 전체 포토부스 업체 반환
     *       - 해시태그들로 업체명 찾기
     */

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

  async findOneBrandById(id: number): Promise<PhotoBoothBrand> {
    const photoBoothBrand = await this.photoBoothBrandRepository.findOneBrand(
      PhotoBoothBrand.byId(id),
    );

    if (!photoBoothBrand) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다.');
    }

    return photoBoothBrand;
  }

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
   * @param createProps * 브랜드 생성 속성들
   *                    * 이벤트 여부, 업체명, 대표이미지, 해시태그들
   * @desc * 해시태그 생성
   *       * 브랜드 생성
   *       * 해시태그와 브랜드 연결
   */
  async createBrandWithHastags(
    createProps: BrandCreateProps,
  ): Promise<boolean> {
    const [brandImages, brandHashtags] =
      await this.prepareBrandAttributes(createProps);

    await this.photoBoothBrandRepository.save(
      plainToInstance(PhotoBoothBrand, {
        brandImages,
        brandHashtags,
        ...createProps,
      }),
    );

    return true;
  }

  /**
   * @param id          * 포토부스 업체에 대한 id
   * @param updateProps * 수정이 필요한 데이터 일부
   *                    * 업체명, 설명, 홈페이지 주소, 대표이미지, 이벤트 여부, 해시태그
   * @desc * 포토부스 업체의 이름, 설명, 업체 홈페이지 url, 해시태그, 대표이미지 수정
   *       * 포토부스 업체 이미지를 여러장 수정
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

    const [brandImages, brandHashtags] =
      await this.prepareBrandAttributes(updateProps);

    await this.hashtagService.removeBrandHashtags(brandId);
    await this.photoBoothBrandRepository.save(
      plainToInstance(PhotoBoothBrand, {
        id,
        brandImages,
        brandHashtags,
        ...updateProps,
      }),
    );

    return true;
  }

  private async prepareBrandAttributes(
    props: BrandCreateProps | BrandUpdateProps,
  ): Promise<[BrandImage[], BrandHashtag[]]> {
    const [eventImages, hashtags] = await Promise.all([
      props.images.map((image) => BrandImage.create(image)),
      this.hashtagService.createHashtags(props.hashtags),
    ]);

    return [
      eventImages,
      hashtags.map((hashtag) => BrandHashtag.create(hashtag)),
    ];
  }
}
