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
import { Page } from '../common/dto/paginated-res.dto';
import {
  GetBoothBrandDetailDto,
  GetPhotoBoothDetailDto,
} from './dto/get-photo-booth-detail.dto';
import { PhotoBooth } from './entity/photo-booth.entity';
import { PaginationProps } from 'src/common/dto/paginated-req.dto';
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
import { BrandCreateProps } from './dto/post-photo-booth.dto';
import { MoveToOpenBoothProps } from './dto/put-photo-booth.dto';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly hiddenBoothRepository: HiddenBoothRepository,
    private readonly photoBoothBrandRepository: PhotoBoothBrandRepository,
  ) {}

  async findOpenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<Page<GetPhotoBoothListDto>> {
    /**
     * @param pageProps - paginated - skip, take
     * @param query - request query string - 지점명, 지역
     * @desc - 쿼리 파라미터에 맞는 포토부스 데이터 반환
     *       - 쿼리 옵션이 없으면 전체 포토부스 데이터 반환
     */

    const photoBooths =
      await this.photoBoothRepository.findBoothByOptionAndCount(
        PhotoBooth.of(query),
        pageProps,
      );

    if (photoBooths[0].length === 0) {
      throw new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다');
    }

    return await this.listPaginatedEntity(
      pageProps,
      photoBooths,
      (entity: PhotoBooth) => new GetPhotoBoothListDto(entity),
    );
  }

  async findOneOpenBooth(id: string): Promise<GetPhotoBoothDetailDto> {
    /**
     * @param id - photobooth의 uuid 값
     * @desc PhotoBooth에 대한 디테일 데이터 반환
     */

    const photoBooth = await this.photoBoothRepository.findOneBoothBy(
      PhotoBooth.byId({ id }),
    );

    if (!photoBooth) {
      throw new NotFoundException(`포토부스 지점을 찾지 못했습니다. ID: ${id}`);
    }

    return new GetPhotoBoothDetailDto(photoBooth);
  }

  async updateOpenBooth(
    id: string,
    updateProps: PhotoBoothUpdateProps,
  ): Promise<boolean> {
    /**
     * @param id - uuid값
     * @param updateProps - 수정이 필요한 데이터 일부 - 지역, 지점명, 주소
     * @desc 포토부스 지점에 대한 데이터 수정
     * @TODO 업체명 변경 업데이트
     */

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
     * @desc - 해당 id의 포토부스 지점을 삭제하고 hiddenBooth로 이동
     *       - hiddenBooth에 id가 존재하지 않으면 새로 생성하고 삭제 처리
     */

    const photoBoothDetail = await this.findOneOpenBooth(id);
    const isDeleted = await this.photoBoothRepository.deletePhotoBooth(id);

    if (!isDeleted) {
      throw new NotFoundException(`포토부스 삭제가 불가능합니다. ID:${id}`);
    }

    await this.updateHiddenBooth(id, {
      name: photoBoothDetail.name,
      location: photoBoothDetail.location,
      streetAddress: photoBoothDetail.streetAddress,
      roadAddress: photoBoothDetail.roadAddress,
      isDelete: true,
    });

    return true;
  }

  async findHiddenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionProps,
  ): Promise<Page<GetPhotoBoothListDto>> {
    /**
     * @param pageProps - paginated - 항목수, 페이지
     * @param query - request query string - 지점명, 지역
     * @desc - 쿼리 파라미터에 맞는 공개되지 않은 포토부스 데이터 반환
     *       - 쿼리 옵션이 없으면 공개되지 않은 전체 포토부스 데이터 반환
     */

    const hiddenBooths =
      await this.hiddenBoothRepository.findHiddenBoothByOptionAndCount(
        HiddenPhotoBooth.of(query),
        pageProps,
      );

    if (hiddenBooths[0].length === 0) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점을 찾지 못했습니다',
      );
    }

    return await this.listPaginatedEntity(
      pageProps,
      hiddenBooths,
      (entity: HiddenPhotoBooth) => new GetPhotoBoothListDto(entity),
    );
  }

  async findOneHiddenBooth(id: string): Promise<GetPhotoBoothDetailDto> {
    /**
     * @param id - photoboothRawData의 uuid 값
     * @desc 공개되지 않은 포토부스에 대한 디테일 데이터 반환
     */
    const hiddenBooth = await this.hiddenBoothRepository.findOneHiddenBoothBy(
      HiddenPhotoBooth.byId({ id }),
    );

    if (!hiddenBooth) {
      throw new NotFoundException(`포토부스 지점을 찾지 못했습니다. ID: ${id}`);
    }

    return new GetPhotoBoothDetailDto(hiddenBooth);
  }

  async updateHiddenBooth(
    id: string,
    updateProps: PhotoBoothUpdateProps,
  ): Promise<boolean> {
    /**
     * @param id - uuid값
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
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     */

    const isPhotoBoothExist = await this.photoBoothRepository.photoBoothHasId(
      PhotoBooth.byId({ id }),
    );

    if (isPhotoBoothExist) {
      throw new BadRequestException('이미 포토부스가 존재합니다');
    }

    const photoBoothBrand = await this.photoBoothBrandRepository.findOneBrandBy(
      PhotoBoothBrand.byName({ name: moveProps.brandName }),
    );

    if (!photoBoothBrand) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다.');
    }

    moveProps.photoBoothBrand = photoBoothBrand;
    await this.photoBoothRepository.saveOpenBooth(PhotoBooth.to(id, moveProps));
    await this.deleteHiddenBooth(id);

    return true;
  }

  async deleteHiddenBooth(id: string): Promise<boolean> {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     */

    await this.updateHiddenBooth(id, {
      isDelete: true,
    });

    return true;
  }

  async findBrandByQueryParam(
    pageProps: PaginationProps,
    query: FindBrandOptionProps,
  ): Promise<Page<GetBoothBrandListDto>> {
    /**
     * @param pageProps - paginated - 항목수, 페이지
     * @param query - request query string - 업체명, 이벤트 허용 여부
     * @desc - 쿼리 파라미터에 맞는 포토부스 업체 반환
     *       - 쿼리 옵션이 없으면 전체 포토부스 업체 반환
     * @TODO - 해시태그로 업체명 찾기
     */

    const boothBrands =
      await this.photoBoothBrandRepository.findBrandByOptionAndCount(
        PhotoBoothBrand.of(query),
        pageProps,
      );

    if (boothBrands[0].length === 0) {
      throw new NotFoundException('포토부스 업체를 찾지 못했습니다');
    }

    return await this.listPaginatedEntity(
      pageProps,
      boothBrands,
      (entity: PhotoBoothBrand) => new GetBoothBrandListDto(entity),
    );
  }

  async findOneBrand(id: number): Promise<GetBoothBrandDetailDto> {
    /**
     * @param id - 포토부스 업체에 대한 id
     * @desc 포토부스 업체의 이름, 대표사진, 지점 목록, 해시태그
     */
    const boothBrand = await this.photoBoothBrandRepository.findOneBrandBy(
      PhotoBoothBrand.byId({ id }),
    );

    if (!boothBrand) {
      throw new NotFoundException(`포토부스 업체를 찾지 못했습니다. ID: ${id}`);
    }

    return new GetBoothBrandDetailDto(boothBrand);
  }

  async createBrand(createProps: BrandCreateProps): Promise<PhotoBoothBrand> {
    /**
     * @desc 포토부스 업체 생성
     * @TODO 해시태그 데이터를 추가
     * @TODO 포토부스 업체 이미지를 여러장 추가
     */
    return await this.photoBoothBrandRepository.saveBrand(
      PhotoBoothBrand.create(createProps),
    );
  }

  async updateBrand(id: number, updateProps: BrandUpdateProps) {
    /**
     * @param id - 포토부스 업체에 대한 id
     * @param updateProps
     *        - 수정이 필요한 데이터 일부
     *        - 업체명, 설명, 홈페이지 주소, 대표이미지, 이벤트 여부
     * @desc 포토부스 업체의 이름, 대표이미지 수정
     * @TODO 해시 태그 데이터를 수정
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

    return true;
  }

  private async listPaginatedEntity<T, U>(
    pageProps: PaginationProps,
    results: [T[], number],
    mapper: (entity: T) => U,
  ): Promise<Page<U>> {
    const { page, take } = pageProps;

    const [entities, count] = results;

    const entityResult = entities.map(mapper);

    return new Page<U>(page, take, count, entityResult);
  }
}
