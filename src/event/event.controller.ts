import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { EventService } from './event.service';
import { SwaggerAPI } from '../common/swagger/api.decorator';
import { ResponseEntity } from '../common/entity/response.entity';
import { EventQueryParam } from './dto/req-event-query.dto';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { GetEventList } from './dto/get-event-list.dto';
import { GetEventDetail } from './dto/get-event-detail.dto';
import { CreateEvent } from './dto/post-event.dto';
import { UpdateEvent } from './dto/patch-event.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('이벤트')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @SwaggerAPI({
    name: '이벤트 목록 조회',
    model: GetEventList,
    isPagination: true,
  })
  async findEventByQueryParam(
    @Query() request: EventQueryParam,
  ): Promise<ResponseEntity<PageEntity<GetEventList>>> {
    const [response, count] = await this.eventService.findEventByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<PageEntity<GetEventList>>(
      '이벤트 목록을 조회합니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map((result) => new GetEventList(result)),
      ),
    );
  }

  @Post()
  @SwaggerAPI({ name: '이벤트 생성', success: 201 })
  async createEvent(
    @Body() request: CreateEvent,
  ): Promise<ResponseEntity<string>> {
    await this.eventService.createEventWithHastags(request.toCreateEntity());
    return ResponseEntity.CREATED('이벤트를 생성 했습니다.');
  }

  @Get(':id')
  @SwaggerAPI({
    name: '이벤트 정보 조회',
    model: GetEventDetail,
  })
  async findOneEvent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetEventDetail>> {
    const response = await this.eventService.findOneEventById(id);
    return ResponseEntity.OK_WITH<GetEventDetail>(
      '요청한 이벤트 정보를 조회합니다.',
      new GetEventDetail(response),
    );
  }

  @Patch(':id')
  @SwaggerAPI({ name: '이벤트 수정' })
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateEvent,
  ): Promise<ResponseEntity<string>> {
    await this.eventService.updateEventWithHastags(
      id,
      request.toUpdateEntity(),
    );
    return ResponseEntity.OK('이벤트를 업데이트 했습니다.');
  }
}
