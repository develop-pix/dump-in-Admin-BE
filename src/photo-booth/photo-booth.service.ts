import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotoBoothService {
  async findAllBooth() {
    /**
     * @desc PhotoBoothRaw, PhotoBooth에 있는 모든 데이터 반환
     */
    return `This action returns all photoBooth`;
  }

  async findBoothByQuery(request) {
    /**
    * @param request - request query string - 포토부스명(Brand), 지역, 업종, 공개여부
    * @desc 쿼리 파라미터에 맞는 데이터 반환 
    *       - 공개여부가 false라면 raw 데이터를 반환
    *       - 공개여부가 true라면 포토부스 데이터를 반환
    */
    return `This action returns photoBooth By Query`;
  }

  async findOneBooth() {
    /**
   * @desc PhotoBoothRaw, PhotoBooth에 대한 디테일 데이터 반환
   */
    return `This action returns a photoBooth`;
  }

  async updateBooth() {
    /**
    * @param id - id값
    * @param request - 수정이 필요한 데이터
    * @desc 포토부스 지점에 대한 데이터 수정
    */
    return `This action updates a photoBooth`;
  }

  async deleteBooth() {
    /**
    * @param id - id값
    * @desc 해당 id의 포토부스 지점 삭제
    */
    return `This action removes a photoBooth`;
  }

  async findAllBrand() {
    /**
    * @desc 포토부스 업체에 대한 정보와 업체가 가지고 있는 지점 정보 반환
    */
    return `This action returns all photoBooth`;
  }

  async findOneBrand() {
    /**
    * @param id - 포토부스 업체에 대한 id
    * @desc 포토부스 업체의 이름, 대표사진, 지점 목록, 해시태그
    */
    return `This action returns a photoBooth`;
  }

  async updateBrand() {
    /**
    * @param id - 포토부스 업체에 대한 id
    * @param request - 포토부스 업체에 대한 수정 데이터
    * @desc 포토부스 업체의 이름, 대표사진, 지점 목록, 해시태그의 데이터를 수정
    */
    return `This action updates a photoBooth`;
  }
}
