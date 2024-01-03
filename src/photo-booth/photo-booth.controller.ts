import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  ParseUUIDPipe,
  Body,
} from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { ApiTags } from '@nestjs/swagger';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { BoothQueryDto } from './dto/get-photo-booth-query.dto';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { GetPhotoBoothDetailDto } from './dto/get-photo-booth-detail.dto';
import { UpdatePhotoBoothDto } from './dto/patch-photo-booth.dto';
import { MoveHiddenToOpenBoothDto } from './dto/put-photo-booth.dto';
import { SwaggerAPI } from '../common/swagger/api.decorator';
import { PhotoBooth } from './entity/photo-booth.entity';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { PhotoBoothPipe } from './pipe/photo-booth.pipe';

@ApiTags('포토부스')
@Controller('photo-booth')
export class PhotoBoothController {
  constructor(private readonly photoBoothService: PhotoBoothService) {}

  @Get()
  @SwaggerAPI({
    name: '앱에 공개된 포토부스 목록 조회',
    model: GetPhotoBoothListDto,
    isPagination: true,
  })
  async findOpenBoothByQueryParam(
    @Query() request: BoothQueryDto,
  ): Promise<ResponseEntity<PageEntity<GetPhotoBoothListDto>>> {
    const [response, count] =
      await this.photoBoothService.findOpenBoothByQueryParam(
        request.getPageProps(),
        request.getQueryProps(),
      );
    return ResponseEntity.OK_WITH<PageEntity<GetPhotoBoothListDto>>(
      '공개된 포토부스 목록을 반환합니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map((result: PhotoBooth) => new GetPhotoBoothListDto(result)),
      ),
    );
  }

  @Get('raw')
  @SwaggerAPI({
    name: '비공개 포토부스 목록 조회',
    model: GetPhotoBoothListDto,
    isPagination: true,
  })
  async findHiddenBoothByQueryParam(
    @Query() request: BoothQueryDto,
  ): Promise<ResponseEntity<PageEntity<GetPhotoBoothListDto>>> {
    const [response, count] =
      await this.photoBoothService.findHiddenBoothByQueryParam(
        request.getPageProps(),
        request.getQueryProps(),
      );
    return ResponseEntity.OK_WITH<PageEntity<GetPhotoBoothListDto>>(
      '비공개 포토부스 목록을 반환합니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map(
          (result: HiddenPhotoBooth) => new GetPhotoBoothListDto(result),
        ),
      ),
    );
  }

  @Get('raw/:id')
  @SwaggerAPI({
    name: '비공개 포토부스 조회',
    model: GetPhotoBoothDetailDto,
  })
  async findOneHiddenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<GetPhotoBoothDetailDto>> {
    const response = await this.photoBoothService.findOneHiddenBooth(id);
    return ResponseEntity.OK_WITH<GetPhotoBoothDetailDto>(
      '비공개 포토부스 목록을 반환합니다.',
      new GetPhotoBoothDetailDto(response),
    );
  }

  @Patch('raw/:id')
  @SwaggerAPI({ name: '비공개 포토부스 수정' })
  async updateHiddenBooth(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdatePhotoBoothDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.updateHiddenBooth(
      id,
      request.toUpdateEntity(),
    );
    return ResponseEntity.OK('비공개 포토부스를 업데이트 했습니다.');
  }

  @Put('raw/:id')
  @SwaggerAPI({ name: '비공개 포토부스를 앱에 노출', success: 201, fail: 409 })
  async moveHiddenToOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: MoveHiddenToOpenBoothDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.moveHiddenToOpenBooth(
      id,
      request.toMoveEntity(),
    );
    return ResponseEntity.CREATED('비공개 포토부스를 공개 했습니다.');
  }

  @Delete('raw/:id')
  @SwaggerAPI({ name: '비공개 포토부스 삭제' })
  async deleteHiddenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.deleteHiddenBooth(id);
    return ResponseEntity.OK('비공개 포토부스를 삭제 했습니다.');
  }

  @Get(':id')
  @SwaggerAPI({
    name: '앱에 공개된 포토부스 상세 조회',
    model: GetPhotoBoothDetailDto,
  })
  async findOneOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<GetPhotoBoothDetailDto>> {
    const response = await this.photoBoothService.findOneOpenBooth(id);
    return ResponseEntity.OK_WITH<GetPhotoBoothDetailDto>(
      '공개된 포토부스 지점을 상세 조회합니다.',
      new GetPhotoBoothDetailDto(response),
    );
  }

  @Patch(':id')
  @SwaggerAPI({ name: '앱에 공개된 포토부스 수정' })
  async updateOpenBooth(
    @Param('id', ParseUUIDPipe, PhotoBoothPipe) id: string,
    @Body() request: UpdatePhotoBoothDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.updateOpenBooth(id, request.toUpdateEntity());
    return ResponseEntity.OK('공개된 포토부스 지점을 업데이트 했습니다.');
  }

  @Delete(':id')
  @SwaggerAPI({ name: '앱에 공개된 포토부스 삭제' })
  async deleteOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.deleteOpenBooth(id);
    return ResponseEntity.OK('공개된 포토부스 지점을 삭제 했습니다.');
  }
}
