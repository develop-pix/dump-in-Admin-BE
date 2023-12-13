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

@Injectable()
export class EventService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly eventRepository: EventRepository,
    private readonly photoBoothService: PhotoBoothService,
  ) {}

  async findEventByQueryParam(
    pageProps: PaginationProps,
    query: FindEventOptionProps,
  ): Promise<[GetEventListDto[], number]> {
    /**
     * @param pageProps - pagination - 항목수, 페이지
     * @param query - request query string - 업체명, 제목
     * @desc - 쿼리 파라미터에 맞는 이벤트 목록 조회
     *       - 쿼리 옵션이 없으면 전체 이벤트 조회
     */

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

  async findOneEventById(id: number): Promise<Events> {
    const event = await this.eventRepository.findOneEvent(Events.byId(id));

    if (!event) {
      throw new NotFoundException('이벤트를 찾지 못했습니다.');
    }

    return event;
  }

  async createEventWithHastags(
    createProps: EventCreateProps,
  ): Promise<boolean> {
    /**
     * @param createProps
     *       - 이벤트 생성 속성들
     *       - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그들
     * @desc - 이벤트 관련 해시태그 생성
     *       - 이벤트 생성
     *       - 해시태그와 이벤트 연결
     */

    await this.photoBoothService.isExistByBrandName(createProps.brandName);

    const event = await this.eventRepository.saveEvent(
      Events.create(createProps),
    );
    await this.hashtagService.handleHashtags(event, createProps.hashtags);

    return true;
  }

  async updateEventWithHastags(
    id: number,
    updateProps: EventUpdateProps,
  ): Promise<boolean> {
    /**
     * @param id - 이벤트 id
     * @param updateProps
     *        - 수정이 필요한 데이터 일부
     *        - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그들
     * @desc 이벤트와 이벤트 관련 해시태그 수정
     * @TODO 이벤트 이미지를 여러장 수정
     */

    await this.photoBoothService.isExistByBrandName(updateProps.brandName);

    const isUpdated = await this.eventRepository.updateEvent(
      id,
      Events.updateBy(updateProps),
    );

    if (!isUpdated) {
      throw new NotFoundException(`이벤트가 업데이트되지 않았습니다. ID:${id}`);
    }

    const event = await this.findOneEventById(id);
    await this.hashtagService.handleHashtags(event, updateProps.hashtags);

    return true;
  }
}
