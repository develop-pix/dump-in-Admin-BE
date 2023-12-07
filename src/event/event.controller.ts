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
import { SwaggerListByQueryParam } from '../common/swagger/query-list.decorator';
import { SwaggerAPI } from '../common/swagger/api.decorator';
import { ResponseEntity } from '../common/entity/response.entity';
import { EventQueryDto } from './dto/get-event-query.dto';
import { Page } from '../common/dto/pagination-res.dto';
import { GetEventListDto } from './dto/get-event-list.dto';
import { GetEventDetailDto } from './dto/get-event-detail.dto';
import { CreateEventDto } from './dto/post-event.dto';
import { UpdateEventDto } from './dto/patch-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @SwaggerListByQueryParam('이벤트', GetEventListDto)
  async findEventByQueryParam(
    @Query() request: EventQueryDto,
  ): Promise<ResponseEntity<Page<GetEventListDto>>> {
    const response = await this.eventService.findEventByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<Page<GetEventListDto>>(
      '이벤트 목록을 반환합니다.',
      response,
    );
  }

  @Post()
  @SwaggerAPI('이벤트 생성', 201)
  async createEvent(
    @Body() request: CreateEventDto,
  ): Promise<ResponseEntity<string>> {
    await this.eventService.createEventWithHastags(request.getCreateProps());
    return ResponseEntity.CREATED('이벤트를 생성 했습니다.');
  }

  @Get(':id')
  @SwaggerAPI('이벤트 정보 조회', 200, GetEventDetailDto)
  async findOneEvent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetEventDetailDto>> {
    const response = await this.eventService.findOneEvent(id);
    return ResponseEntity.OK_WITH<GetEventDetailDto>(
      '요청한 이벤트 정보를 반환합니다.',
      response,
    );
  }

  @Patch(':id')
  @SwaggerAPI('이벤트 수정')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateEventDto,
  ): Promise<ResponseEntity<string>> {
    await this.eventService.updateEventWithHastags(
      id,
      request.getUpdateProps(),
    );
    return ResponseEntity.OK('이벤트를 업데이트 했습니다.');
  }
}
