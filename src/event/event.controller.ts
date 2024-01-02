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
import { EventQueryDto } from './dto/get-event-query.dto';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { GetEventListDto } from './dto/get-event-list.dto';
import { GetEventDetailDto } from './dto/get-event-detail.dto';
import { CreateEventDto } from './dto/post-event.dto';
import { UpdateEventDto } from './dto/patch-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { Events } from './entity/event.entity';

@ApiTags('이벤트')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @SwaggerAPI({
    name: '이벤트 목록 조회',
    model: GetEventListDto,
    isPagination: true,
  })
  async findEventByQueryParam(
    @Query() request: EventQueryDto,
  ): Promise<ResponseEntity<PageEntity<GetEventListDto>>> {
    const [response, count] = await this.eventService.findEventByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<PageEntity<GetEventListDto>>(
      '이벤트 목록을 조회합니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map((result: Events) => new GetEventListDto(result)),
      ),
    );
  }

  @Post()
  @SwaggerAPI({ name: '이벤트 생성', success: 201 })
  async createEvent(
    @Body() request: CreateEventDto,
  ): Promise<ResponseEntity<string>> {
    await this.eventService.createEventWithHastags(request.toCreateEntity());
    return ResponseEntity.CREATED('이벤트를 생성 했습니다.');
  }

  @Get(':id')
  @SwaggerAPI({
    name: '이벤트 정보 조회',
    model: GetEventDetailDto,
  })
  async findOneEvent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetEventDetailDto>> {
    const response = await this.eventService.findOneEventById(id);
    return ResponseEntity.OK_WITH<GetEventDetailDto>(
      '요청한 이벤트 정보를 조회합니다.',
      new GetEventDetailDto(response),
    );
  }

  @Patch(':id')
  @SwaggerAPI({ name: '이벤트 수정' })
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateEventDto,
  ): Promise<ResponseEntity<string>> {
    await this.eventService.updateEventWithHastags(
      id,
      request.toUpdateEntity(),
    );
    return ResponseEntity.OK('이벤트를 업데이트 했습니다.');
  }
}
