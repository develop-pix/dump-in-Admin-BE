import { Injectable, NotFoundException } from '@nestjs/common';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { Page } from '../common/dto/paginated-res.dto';
import { GetPhotoBoothDetailDto } from './dto/get-photo-booth-detail.dto';
import { PhotoBooth } from './entity/photo-booth.entity';
import { PaginationProps } from 'src/common/dto/paginated-req.dto';
import { FindBoothOptionWhere } from './dto/get-photo-booth-query.dto';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { PhotoBoothUpdateProps } from './dto/patch-photo-booth.dto';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly hiddenBoothRepository: HiddenBoothRepository,
  ) {}

  async findOpenBoothByQueryParam(
    pageProps: PaginationProps,
    query: FindBoothOptionWhere,
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
    pageProps: PaginationProps,
    query: FindBoothOptionWhere,
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

  async findOneHiddenBooth(id: string) {
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
        `비공개 포토부스가 업데이트되지 않았습니다. ID:${id}`,
      );
    }

    return true;
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
     * @TODO 해시태그 데이터를 추가
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
     * @TODO 해시 태그 데이터를 수정
     */
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
