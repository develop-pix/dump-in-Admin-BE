import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './repository/event.repository';
import { HashtagService } from '../hashtag/hashtag.service';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { FindEventOptionProps } from './dto/get-event-query.dto';
import { GetEventListDto } from './dto/get-event-list.dto';
import { Events } from './entity/event.entity';
import { PhotoBoothService } from '../photo-booth/photo-booth.service';
import { EventCreateProps } from './dto/post-event.dto';
import { EventUpdateProps } from './dto/patch-event.dto';
import { EventImage } from './entity/event-image.entity';
import { EventHashtag } from '../hashtag/entity/event-hashtag.entity';
import { PhotoBoothBrand } from '../photo-booth/entity/photo-booth-brand.entity';

@Injectable()
export class EventService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly eventRepository: EventRepository,
    private readonly photoBoothService: PhotoBoothService,
  ) {}

  /**
   * @param pageProps - Pagination (항목수, 페이지)
   * @param query - Request Query (업체명, 제목)
   * @desc - 쿼리 파라미터에 맞는 이벤트 목록 조회
   *       - 쿼리 옵션이 없으면 전체 이벤트 조회
   */
  async findEventByQueryParam(
    pageProps: PaginationProps,
    query: FindEventOptionProps,
  ): Promise<[GetEventListDto[], number]> {
    const [results, count] =
      await this.eventRepository.findEventByOptionAndCount(
        Events.of(query),
        pageProps,
      );

    if (count === 0) {
      throw new NotFoundException('이벤트를 찾지 못했습니다');
    }

    return [
      results.map((result: Events) => new GetEventListDto(result)),
      count,
    ];
  }

  /**
   * @param pageProps - Pagination (항목수, 페이지)
   * @param query - Request Query (업체명, 제목)
   * @desc - 쿼리 파라미터에 맞는 이벤트 목록 조회
   *       - 쿼리 옵션이 없으면 전체 이벤트 조회
   */
  async findOneEventById(id: number): Promise<Events> {
    const event = await this.eventRepository.findOneEvent(Events.byId(id));

    if (!event) {
      throw new NotFoundException('이벤트를 찾지 못했습니다.');
    }

    return event;
  }

  /**
   * @param createProps - 이벤트 생성 속성들
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그들
   *       - 이벤트 관련 해시태그 생성
   *       - 이벤트 생성
   *       - 해시태그와 이벤트 연결
   */
  async createEventWithHastags(
    createProps: EventCreateProps,
  ): Promise<boolean> {
    const [photoBoothBrand, eventImages, eventHashtags] =
      await this.prepareEventAttributes(createProps);

    await this.eventRepository.save({
      photoBoothBrand,
      eventImages,
      eventHashtags,
      ...createProps,
    });

    return true;
  }

  /**
   * @param id - 이벤트 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그
   *       - 이벤트와 이벤트 관련 해시태그 수정
   *       - 이벤트 이미지를 여러장 수정
   */
  async updateEventWithHastags(
    id: number,
    updateProps: EventUpdateProps,
  ): Promise<boolean> {
    const eventId = Events.byId(id);
    const isExistEvent = this.eventRepository.hasId(eventId);

    if (!isExistEvent) {
      throw new NotFoundException('업데이트할 이벤트가 없습니다.');
    }

    const [photoBoothBrand, eventImages, eventHashtags] =
      await this.prepareEventAttributes(updateProps);

    await this.hashtagService.removeEventHashtags(eventId);

    await this.eventRepository.save({
      id,
      eventImages,
      eventHashtags,
      photoBoothBrand,
      ...updateProps,
    });

    return true;
  }

  /**
   * @param props - 이벤트 생성 및 수정에 필요한 속성들
   * @desc  - 이벤트 관련 업체명 가져오기
   *        - 이벤트 관련 해시태그 가져오기
   *        - 이벤트 이미지 엔티티에 이벤트 이미지를 삽입
   */
  private async prepareEventAttributes(
    props: EventCreateProps | EventUpdateProps,
  ): Promise<[PhotoBoothBrand, EventImage[], EventHashtag[]]> {
    const [photoBoothBrand, eventImages, hashtags] = await Promise.all([
      this.photoBoothService.findOneBrandByName(props.brandName),
      props.images?.map((image) => EventImage.create(image)),
      this.hashtagService.createHashtags(props.hashtags),
    ]);

    return [
      photoBoothBrand,
      eventImages,
      hashtags.map((hashtag) => EventHashtag.create(hashtag)),
    ];
  }
}
