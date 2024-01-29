import { Injectable } from '@nestjs/common';
import { EventRepository } from './repository/event.repository';
import { HashtagService } from '../hashtag/hashtag.service';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { Events } from './entity/event.entity';
import { EventHashtag } from '../hashtag/entity/event-hashtag.entity';
import { PhotoBoothBrand } from '../brand/entity/brand.entity';
import { BrandService } from '../brand/brand.service';
import {
  EventCreateProps,
  FindEventOptionProps,
  ToEventProps,
} from './event.interface';

@Injectable()
export class EventService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly eventRepository: EventRepository,
    private readonly brandService: BrandService,
  ) {}

  /**
   * @param pageProps - Pagination (항목수, 페이지)
   * @param query - Request Query (업체명, 제목)
   * @desc - 쿼리 파라미터에 맞는 이벤트 목록 조회
   *       - 쿼리 옵션이 없으면 전체 이벤트 조회
   */
  findEventByQueryParam(
    pageProps: PaginationProps,
    query: FindEventOptionProps,
  ): Promise<[Events[], number]> {
    return this.eventRepository.findEventByOptionAndCount(
      Events.of(query),
      pageProps,
    );
  }

  /**
   * @param id - 이벤트 id
   * @desc - 이벤트 id에 맞는 이벤트 조회
   * @throws 존재하지 않는 이벤트 (EntityNotFoundError)
   */
  findOneEventById(id: number): Promise<Events> {
    return this.eventRepository.findOneEvent(Events.byId(id));
  }

  /**
   * @param createProps - 이벤트 생성 속성들
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그들
   *       - 이벤트 관련 해시태그 생성
   *       - 이벤트 생성
   *       - 해시태그와 이벤트 연결
   * @see {@link prepareEventAttributes} 를 호출하여 이벤트 생성에 필요한 속성들을 준비합니다.
   */
  async createEventWithHastags(createProps: EventCreateProps): Promise<Events> {
    const [photoBoothBrand, eventHashtags] =
      await this.prepareEventAttributes(createProps);
    return this.eventRepository.save({
      photoBoothBrand,
      eventHashtags,
      ...createProps,
    });
  }

  /**
   * @param id - 이벤트 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그
   *       - 이벤트와 이벤트 관련 해시태그 수정
   *       - 이벤트 이미지를 여러장 수정
   * @see {@link findOneEventById} 를 호출하여 이벤트를 찾습니다.
   * @see {@link prepareEventAttributes} 를 호출하여 이벤트 생성에 필요한 속성들을 준비합니다.
   */
  async updateEventWithHastags(
    id: number,
    updateProps: ToEventProps,
  ): Promise<Events> {
    await this.findOneEventById(id);
    const [photoBoothBrand, eventHashtags] =
      await this.prepareEventAttributes(updateProps);
    return this.eventRepository.save({
      id,
      eventHashtags,
      photoBoothBrand,
      ...updateProps,
    });
  }

  /**
   * @param props - 이벤트 생성 및 수정에 필요한 속성들
   * @desc  - 이벤트 관련 업체명 가져오기
   *        - 이벤트 관련 해시태그 가져오기
   *        - 이벤트 이미지 엔티티에 이벤트 이미지를 삽입
   */
  private async prepareEventAttributes(
    props: EventCreateProps | ToEventProps,
  ): Promise<[PhotoBoothBrand, EventHashtag[]]> {
    return await Promise.all([
      this.brandService.findOneBrandBy(props.brandName),
      this.hashtagService.eventHashtags(props.hashtags),
    ]);
  }
}
