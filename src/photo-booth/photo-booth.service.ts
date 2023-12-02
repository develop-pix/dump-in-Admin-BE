import { Injectable, NotFoundException } from '@nestjs/common';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { PhotoBoothRawRepository } from './repository/photo-booth-raw-data.repository';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { Page } from '../common/dto/paginated-res.dto';
import { GetPhotoBoothDetailDto } from './dto/get-photo-booth-detail.dto';
import { PhotoBooth, PhotoBoothUpdateProps } from './entity/photo-booth.entity';
import { PaginatedProps } from 'src/common/dto/paginated-req.dto';
import { FindBoothOptionWhere } from './dto/get-photo-booth-query.dto';
import { PhotoBoothRawData } from './entity/raw-data.entity';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly photoBoothRawRepository: PhotoBoothRawRepository,
  ) {}

  async findOpenBoothByQueryParam(
    pageProps: PaginatedProps,
    query: FindBoothOptionWhere,
  ): Promise<Page<GetPhotoBoothListDto>> {
    /**
     * @param pageProps - paginated - 항목수, 페이지
     * @param query - request query string - 지점명, 지역
     * @desc - 쿼리 파라미터에 맞는 포토부스 데이터 반환
     *       - 쿼리 옵션이 없으면 전체 포토부스 데이터 반환
     */

    const { page, take } = pageProps;
    const [photoBooths, count] =
      await this.photoBoothRepository.findBoothByOptionAndCount(
        PhotoBooth.of(query),
        pageProps,
      );

    if (photoBooths.length === 0) {
      throw new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다');
    }

    const photoBoothResult = photoBooths.map(
      (photoBooth) => new GetPhotoBoothListDto(photoBooth),
    );

    return new Page<GetPhotoBoothListDto>(page, take, count, photoBoothResult);
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
      throw new NotFoundException(
        `포토부스가 업데이트되지 않았습니다. ID:${id}`,
      );
    }

    return true;
  }

  async deleteOpenBooth() {
    /**
     * @param id - id값
     * @desc 해당 id의 포토부스 지점을 삭제하고 Raw 데이터로 이동
     * @TODO Raw Data에서 exist 작성 후 적용
     */
  }

  async findHiddenBoothByQuery(
    pageProps: PaginatedProps,
    query: FindBoothOptionWhere,
  ): Promise<Page<GetPhotoBoothListDto>> {
    /**
     * @param pageProps - paginated - 항목수, 페이지
     * @param query - request query string - 지점명, 지역
     * @desc - 쿼리 파라미터에 맞는 공개되지 않은 포토부스 데이터 반환
     *       - 쿼리 옵션이 없으면 공개되지 않은 전체 포토부스 데이터 반환
     */

    const { page, take } = pageProps;
    const [hiddenPhotoBooths, count] =
      await this.photoBoothRawRepository.findHiddenBoothByOptionAndCount(
        PhotoBoothRawData.of(query),
        pageProps,
      );

    if (hiddenPhotoBooths.length === 0) {
      throw new NotFoundException(
        '공개되지 않은 포토부스 지점을 찾지 못했습니다',
      );
    }

    const hiddenPhotoBoothResult = hiddenPhotoBooths.map(
      (photoBooth) => new GetPhotoBoothListDto(photoBooth),
    );

    return new Page<GetPhotoBoothListDto>(
      page,
      take,
      count,
      hiddenPhotoBoothResult,
    );
  }

  async findOneHiddenBooth() {
    /**
     * @param id - photoboothRawData의 uuid 값
     * @desc 공개되지 않은 포토부스에 대한 디테일 데이터 반환
     */
  }

  async updateHiddenBooth() {
    /**
     * @param id - uuid값
     * @param updateProps - 수정이 필요한 데이터 일부 - 지역, 지점명, 주소
     * @desc 공개되지 않은 포토부스 지점에 대한 데이터 수정
     */
  }

  async moveHiddenToOpenBooth() {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     */
  }

  async deleteHiddenBooth() {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     */
  }

  async createBrand() {
    /**
     * @desc 포토부스 업체에 대한 정보와 업체가 가지고 있는 지점 정보 반환
     */
  }

  async findAllBrand() {
    /**
     * @desc 포토부스 업체에 대한 정보와 업체가 가지고 있는 지점 정보 반환
     */
  }

  async findOneBrand() {
    /**
     * @param id - 포토부스 업체에 대한 id
     * @desc 포토부스 업체의 이름, 대표사진, 지점 목록, 해시태그
     */
  }

  async updateBrand() {
    /**
     * @param id - 포토부스 업체에 대한 id
     * @param request - 포토부스 업체에 대한 수정 데이터
     * @desc 포토부스 업체의 이름, 대표사진, 지점 목록, 해시태그의 데이터를 수정
     */
  }
}
