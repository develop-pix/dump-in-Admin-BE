import { Injectable, NotFoundException } from '@nestjs/common';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { PhotoBoothRawRepository } from './repository/photo-booth-raw-data.repository';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { BoothQueryDto } from './dto/get-photo-booth-query.dto';
import { Page } from '../common/dto/paginated-res.dto';
import { GetPhotoBoothDetailDto } from './dto/get-photo-booth-detail.dto';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly photoBoothRawRepository: PhotoBoothRawRepository,
  ) { }

  async findOpenBoothByQueryParam(
    request: BoothQueryDto,
  ): Promise<Page<GetPhotoBoothListDto>> {
    /**
     * @param request - request query string - 지점명, 지역
     * @param request - request paginated - 항목수, 페이지
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     */

    const { page, take } = request;
    const [photoBooths, count] =
      await this.photoBoothRepository.findBoothByOptionAndCount(request);

    if (photoBooths.length === 0) {
      throw new NotFoundException('공개된 포토부스 지점을 찾지 못했습니다');
    }

    const photoBoothResult = photoBooths.map(
      (photoBooth) => new GetPhotoBoothListDto(photoBooth),
    );

    return new Page<GetPhotoBoothListDto>(page, take, count, photoBoothResult);
  }

  async findOneOpenBooth(id: string) {
    /**
     * @param id - photobooth의 uuid 값
     * @desc PhotoBooth에 대한 디테일 데이터 반환
     */
    const photoBooth = await this.photoBoothRepository.findOneBoothById(id);

    if (!photoBooth) {
      throw new NotFoundException(`포토부스 지점을 찾지 못했습니다. ID: ${id}`);
    }

    return new GetPhotoBoothDetailDto(photoBooth);
  }

  async updateOpenBooth() {
    /**
     * @param id - id값
     * @param request - 수정이 필요한 데이터 일부
     * @desc 포토부스 지점에 대한 데이터 수정
     */
  }

  async deleteOpenBooth() {
    /**
     * @param id - id값
     * @desc 해당 id의 포토부스 지점 삭제
     */
  }

  async findHiddenBoothByQuery() {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     *       - 공개여부가 false라면 raw 데이터를 반환
     *       - 공개여부가 true라면 포토부스 데이터를 반환
     */
  }

  async findOneHiddenBooth() {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     *       - 공개여부가 false라면 raw 데이터를 반환
     *       - 공개여부가 true라면 포토부스 데이터를 반환
     */
  }

  async moveHiddenToOpenBooth() {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     *       - 공개여부가 false라면 raw 데이터를 반환
     *       - 공개여부가 true라면 포토부스 데이터를 반환
     */
  }

  async updateHiddenBooth() {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     *       - 공개여부가 false라면 raw 데이터를 반환
     *       - 공개여부가 true라면 포토부스 데이터를 반환
     */
  }

  async deleteHiddenBooth() {
    /**
     * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
     * @desc 쿼리 파라미터에 맞는 데이터 반환
     *       - 공개여부가 false라면 raw 데이터를 반환
     *       - 공개여부가 true라면 포토부스 데이터를 반환
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
