import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './repository/event.repository';
import { HashtagService } from '../hashtag/hashtag.service';
import { PaginationProps } from '../common/dto/pagination-req.dto';
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
     * @param query - request query string - 업체명, 이벤트 허용 여부
     * @desc - 쿼리 파라미터에 맞는 포토부스 업체 반환
     *       - 쿼리 옵션이 없으면 전체 포토부스 업체 반환
     *       - 해시태그들로 업체명 찾기
     */

    query.brand = await this.photoBoothService.findOneBrandByName(
      query.brandName,
    );

    const [results, count] =
      await this.eventRepository.findEventByOptionAndCount(
        Events.of(query),
        pageProps,
      );

    if (results.length === 0) {
      throw new NotFoundException('이벤트를 찾지 못했습니다');
    }

    return [
      results.map((result: Events) => new GetEventListDto(result)),
      count,
    ];
  }

  async findOneEventById(id: number): Promise<Events> {
    const event = await this.eventRepository.findOneEventBy(Events.byId(id));

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
     *       - 브랜드 생성 속성들
     *       - 이벤트 여부, 업체명, 대표이미지, 해시태그들
     * @desc - 해시태그 생성
     *       - 브랜드 생성
     *       - 해시태그와 브랜드 연결
     */

    const isExistEvent = await this.eventRepository.isExistEvent(
      Events.of({ title: createProps.title }),
    );

    if (isExistEvent) {
      throw new NotFoundException('같은 제목의 이벤트가 존재합니다');
    }

    createProps.brand = await this.photoBoothService.findOneBrandByName(
      createProps.brandName,
    );

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
     * @param id - 포토부스 업체에 대한 id
     * @param updateProps
     *        - 수정이 필요한 데이터 일부
     *        - 업체명, 설명, 홈페이지 주소, 대표이미지, 이벤트 여부
     *        - 해시태그
     * @desc 포토부스 업체의 이름, 설명, 업체 홈페이지 url, 해시태그, 대표이미지 수정
     * @TODO 포토부스 업체 이미지를 여러장 수정
     */

    updateProps.brand = await this.photoBoothService.findOneBrandByName(
      updateProps.brandName,
    );

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
