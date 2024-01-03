import { Injectable } from '@nestjs/common';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { PhotoBooth } from './entity/photo-booth.entity';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { BrandService } from '../brand/brand.service';
import { FindBoothOptionProps, ToBoothProps } from './photo-booth.interface';
import { PhotoBoothBrand } from '../brand/entity/brand.entity';

@Injectable()
export class PhotoBoothService {
  constructor(
    private readonly photoBoothRepository: PhotoBoothRepository,
    private readonly hiddenBoothRepository: HiddenBoothRepository,
    private readonly brandService: BrandService,
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
  findOneOpenBooth(id: string): Promise<PhotoBooth> {
    return this.photoBoothRepository.findOneBooth(PhotoBooth.byId(id));
  }

  /**
   * @param id - 공개 포토부스의 uuid값
   * @param props - 저장할 필요한 데이터 일부 (지역, 지점명, 주소 등)
   * @desc 포토부스 지점에 대한 데이터 저장
   */
  async saveOpenBooth(props: ToBoothProps, id?: string): Promise<PhotoBooth> {
    const photoBoothBrand = await this.brandService.findOneBrandBy(
      PhotoBoothBrand.byName(props.brandName),
    );
    return this.photoBoothRepository.save({ id, photoBoothBrand, ...props });
  }

  /**
   * @param id - 공개 포토부스의 uuid값
   * @param updateProps - 수정이 필요한 데이터 일부 (지역, 지점명, 주소)
   * @desc 포토부스 지점에 대한 데이터 수정
   */
  async updateOpenBooth(
    id: string,
    updateProps: ToBoothProps,
  ): Promise<PhotoBooth> {
    await this.findOneOpenBooth(id);
    return this.saveOpenBooth(updateProps, id);
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
  findOneHiddenBooth(id: string): Promise<HiddenPhotoBooth> {
    return this.hiddenBoothRepository.findOneHiddenBooth(
      HiddenPhotoBooth.byId(id),
    );
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @param updateProps - 수정이 필요한 데이터 일부 - 지역, 지점명, 주소
   * @desc 공개되지 않은 포토부스 지점에 대한 데이터 수정
   */
  async updateHiddenBooth(
    id: string,
    updateProps: ToBoothProps,
  ): Promise<HiddenPhotoBooth> {
    const booth = await this.findOneHiddenBooth(id);
    const updatedBooth = this.hiddenBoothRepository.merge(booth, updateProps);
    return this.hiddenBoothRepository.save(updatedBooth);
  }

  /**
   * @param id - 비공개 포토부스의 uuid
   * @param moveProps - 비공개 포토부스에서 공개 포토부스로 이동 시킬때 필요한 속성
   * @desc - 브랜드 엔티티에서 업체명이 있으면 해당 업체명으로 업데이트
   *       - 공개 포토부스로 이동
   */
  async moveHiddenToOpenBooth(
    id: string,
    moveProps: ToBoothProps,
  ): Promise<PhotoBooth> {
    await this.deleteHiddenBooth(id);
    return this.saveOpenBooth(moveProps, id);
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
}
