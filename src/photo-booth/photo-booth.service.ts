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
import { PaginationProps } from 'src/common/dto/pagination-req.dto';
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
import {
  PhotoBoothBrand,
  PhotoBoothHashtag,
} from './entity/photo-booth-brand.entity';
import { BrandCreateProps } from './dto/post-photo-booth.dto';
import { MoveToOpenBoothProps } from './dto/put-photo-booth.dto';
import { PhotoBoothHashtagRepository } from './repository/photo-booth-hashtag.repository';
import { HashtagService } from '../hashtag/hashtag.service';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly hiddenBoothRepository: HiddenBoothRepository,
    private readonly photoBoothBrandRepository: PhotoBoothBrandRepository,
    private readonly photoBoothHashtagRepository: PhotoBoothHashtagRepository,
    private readonly hashtagService: HashtagService,
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

    query.brand = query.brandName
      ? await this.findOneBrandByName(query.brandName)
      : undefined;

    const [results, count] =
      await this.photoBoothRepository.findBoothByOptionAndCount(
        PhotoBooth.of(query),
        pageProps,
      );

    if (results.length === 0) {
      throw new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다');
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

    const photoBooth = await this.photoBoothRepository.findOneBoothBy(
      PhotoBooth.byId({ id }),
    );

    if (!photoBooth) {
      throw new NotFoundException(`포토부스 지점을 찾지 못했습니다. ID: ${id}`);
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

    updateProps.brand = updateProps.brandName
      ? await this.findOneBrandByName(updateProps.brandName)
      : undefined;

    const isUpdated = await this.photoBoothRepository.updatePhotoBooth(
      id,
      PhotoBooth.updateBy(updateProps),
    );

    if (!isUpdated) {
      throw new NotFoundException(`포토부스를 찾지 못했습니다. ID:${id}`);
    }

    return true;
  }

  async deleteOpenBooth(id: string): Promise<boolean> {
    /**
     * @param id - uuid값
     * @desc - 해당 id의 포토부스 지점을 삭제하고 hiddenBooth로 업데이트
     */

    const isDeleted = await this.photoBoothRepository.deletePhotoBooth(id);

    if (!isDeleted) {
      throw new NotFoundException(`포토부스 삭제가 불가능합니다. ID:${id}`);
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

    if (results.length === 0) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점 목록을 찾지 못했습니다',
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

    const hiddenBooth = await this.hiddenBoothRepository.findOneHiddenBoothBy(
      HiddenPhotoBooth.byId({ id }),
    );

    if (!hiddenBooth) {
      throw new NotFoundException(
        `공개되지 않은 포토부스 지점을 찾지 못했습니다. ID: ${id}`,
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

    const isUpdated = await this.hiddenBoothRepository.updateHiddenBooth(
      id,
      HiddenPhotoBooth.updateBy(updateProps),
    );

    if (!isUpdated) {
      throw new NotFoundException(
        `비공개 포토부스 업데이트가 불가능합니다. ID:${id}`,
      );
    }

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

    const isPhotoBoothExist = await this.photoBoothRepository.photoBoothHasId(
      PhotoBooth.byId({ id }),
    );

    if (isPhotoBoothExist) {
      throw new BadRequestException('이미 포토부스가 존재합니다');
    }

    moveProps.brand = await this.findOneBrandByName(moveProps.brandName);
    await this.photoBoothRepository.saveOpenBooth(PhotoBooth.to(id, moveProps));
    await this.deleteHiddenBooth(id);

    return true;
  }

  async deleteHiddenBooth(id: string): Promise<boolean> {
    /**
     * @param id - 비공개 포토부스의 uuid
     * @desc uuid 값을 가진 비공개 포토부스를 찾아서 삭제 처리 (soft)
     */

    await this.updateHiddenBooth(id, {
      isDelete: true,
    });

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

    if (results.length === 0) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다');
    }

    return [
      results.map(
        (entity: PhotoBoothBrand) => new GetBoothBrandListDto(entity),
      ),
      count,
    ];
  }

  async findOneBrandByName(name: string): Promise<PhotoBoothBrand> {
    /**
     * @param name 포토부스 업체명
     * @desc - 이름으로 포토부스 업체명 검색 후 포토부스 업체 정보 반환
     */

    const photoBoothBrand = await this.photoBoothBrandRepository.findOneBrandBy(
      PhotoBoothBrand.byName({ name }),
    );

    if (!photoBoothBrand) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다.');
    }

    return photoBoothBrand;
  }

  async findOneBrandById(id: number): Promise<PhotoBoothBrand> {
    const photoBoothBrand = await this.photoBoothBrandRepository.findOneBrandBy(
      PhotoBoothBrand.byId({ id }),
    );

    if (!photoBoothBrand) {
      throw new NotFoundException(`포토부스 업체를 찾지 못했습니다. ID: ${id}`);
    }

    return photoBoothBrand;
  }

  async createBrandWithHastags(
    createProps: BrandCreateProps,
  ): Promise<boolean> {
    /**
     * @param createProps
     *       - 브랜드 생성 속성들
     *       - 이벤트 여부, 업체명, 대표이미지, 해시태그들
     * @desc - 해시태그 생성
     *       - 브랜드 생성
     *       - 해시태그와 브랜드 연결
     */

    const isExistBrand = await this.photoBoothBrandRepository.isExistBrand(
      PhotoBoothBrand.of({ name: createProps.name }),
    );

    if (isExistBrand) {
      throw new NotFoundException('이미 포토부스 업체가 존재합니다');
    }

    const brand = await this.photoBoothBrandRepository.saveBrand(
      PhotoBoothBrand.create(createProps),
    );
    await this.handleBrandHashtags(brand, createProps.hashtags);

    return true;
  }

  async updateBrandWithHastags(
    id: number,
    updateProps: BrandUpdateProps,
  ): Promise<boolean> {
    /**
     * @param id - 포토부스 업체에 대한 id
     * @param updateProps
     *        - 수정이 필요한 데이터 일부
     *        - 업체명, 설명, 홈페이지 주소, 대표이미지, 이벤트 여부
     *        - 해시태그
     * @desc 포토부스 업체의 이름, 설명, 업체 홈페이지 url, 해시태그, 대표이미지 수정
     * @TODO 포토부스 업체 이미지를 여러장 수정
     */

    const isUpdated = await this.photoBoothBrandRepository.updateBoothBrand(
      id,
      PhotoBoothBrand.updateBy(updateProps),
    );

    if (!isUpdated) {
      throw new NotFoundException(
        `포토부스 업체가 업데이트되지 않았습니다. ID:${id}`,
      );
    }

    const brand = await this.findOneBrandById(id);
    await this.handleBrandHashtags(brand, updateProps.hashtags);

    return true;
  }

  private async handleBrandHashtags(
    brand: PhotoBoothBrand,
    hashtags: string[],
  ): Promise<void> {
    /**
     * @param brand - 포토부스 업체 정보
     * @param hashtags
     *       - 해시태그 여러개를 가진 배열
     * @desc - 포토부스 업체와 연결된 포토부스 모든 해시태그 반환
     *       - 포토부스 업체와 연결된 모든 해시태그 연결을 삭제
     *       - hashtags 배열 내부의 해시태그가 존재하면 해시태그 생성 메서드 실행
     */

    const allHashtagsOfBrand =
      await this.photoBoothHashtagRepository.findManyHashtagsOfBrand(
        PhotoBoothHashtag.of({ brand }),
      );

    await this.photoBoothHashtagRepository.removeAllHashtagsOfBrand(
      allHashtagsOfBrand,
    );

    if (hashtags.length !== 0) {
      const allHashtags = await this.hashtagService.createHashtags(hashtags);
      await this.photoBoothHashtagRepository.saveBrandHashtags(
        allHashtags.map((hashtag) =>
          PhotoBoothHashtag.create({ brand, hashtag }),
        ),
      );
    }
  }
}
