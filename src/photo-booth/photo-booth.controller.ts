import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  Post,
  Put,
  ParseUUIDPipe,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { ApiTags } from '@nestjs/swagger';
import {
  GetBoothBrandListDto,
  GetPhotoBoothListDto,
} from './dto/get-photo-booth-list.dto';
import { ResponseEntity } from 'src/common/entity/response.entity';
import {
  BoothQueryDto,
  BoothBrandQueryDto,
} from './dto/get-photo-booth-query.dto';
import { Page } from '../common/dto/pagination-res.dto';
import {
  GetBoothBrandDetailDto,
  GetPhotoBoothDetailDto,
} from './dto/get-photo-booth-detail.dto';
import {
  UpdateBoothBrandDto,
  UpdatePhotoBoothDto,
} from './dto/patch-photo-booth.dto';
import { CreateBoothBrandDto } from './dto/post-photo-booth.dto';
import { MoveHiddenToOpenBoothDto } from './dto/put-photo-booth.dto';
import { SwaggerAPI } from '../common/swagger/api.decorator';

@ApiTags('포토부스')
@Controller('photo-booth')
export class PhotoBoothController {
  constructor(private readonly photoBoothService: PhotoBoothService) {}

  @Get()
  @SwaggerAPI({
    name: '앱에 공개된 포토부스 목록 조회',
    response: GetPhotoBoothListDto,
    isArray: true,
  })
  async findOpenBoothByQueryParam(
    @Query() request: BoothQueryDto,
  ): Promise<ResponseEntity<Page<GetPhotoBoothListDto>>> {
    const [response, count] =
      await this.photoBoothService.findOpenBoothByQueryParam(
        request.getPageProps(),
        request.getQueryProps(),
      );
    return ResponseEntity.OK_WITH<Page<GetPhotoBoothListDto>>(
      '공개된 포토부스 목록을 반환합니다.',
      Page.create(request.getPageProps(), count, response),
    );
  }

  @Get(':id')
  @SwaggerAPI({
    name: '앱에 공개된 포토부스 상세 조회',
    response: GetPhotoBoothDetailDto,
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdatePhotoBoothDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.updateOpenBooth(id, request.getUpdateProps());
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

  @Get('raw')
  @SwaggerAPI({
    name: '비공개 포토부스 목록 조회',
    response: GetPhotoBoothListDto,
    isArray: true,
  })
  async findHiddenBoothByQueryParam(
    @Query() request: BoothQueryDto,
  ): Promise<ResponseEntity<Page<GetPhotoBoothListDto>>> {
    const [response, count] =
      await this.photoBoothService.findHiddenBoothByQueryParam(
        request.getPageProps(),
        request.getQueryProps(),
      );
    return ResponseEntity.OK_WITH<Page<GetPhotoBoothListDto>>(
      '비공개 포토부스 목록을 반환합니다.',
      Page.create(request.getPageProps(), count, response),
    );
  }

  @Get('raw/:id')
  @SwaggerAPI({
    name: '비공개 포토부스 조회',
    response: GetPhotoBoothDetailDto,
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
      request.getUpdateProps(),
    );
    return ResponseEntity.OK('비공개 포토부스를 업데이트 했습니다.');
  }

  @Put('raw/:id')
  @SwaggerAPI({ name: '비공개 포토부스를 앱에 노출', status: 201 })
  async moveHiddenToOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: MoveHiddenToOpenBoothDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.moveHiddenToOpenBooth(
      id,
      request.getUpdateProps(),
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

  @Get('brand')
  @SwaggerAPI({
    name: '포토부스 업체 목록 조회',
    response: GetBoothBrandListDto,
    isArray: true,
  })
  async findBrandByQueryParam(
    @Query() request: BoothBrandQueryDto,
  ): Promise<ResponseEntity<Page<GetBoothBrandListDto>>> {
    const [response, count] =
      await this.photoBoothService.findBrandByQueryParam(
        request.getPageProps(),
        request.getQueryProps(),
      );
    return ResponseEntity.OK_WITH<Page<GetBoothBrandListDto>>(
      '포토부스 업체 목록을 반환합니다.',
      Page.create(request.getPageProps(), count, response),
    );
  }

  @Post('brand')
  @SwaggerAPI({ name: '포토부스 업체 생성', status: 201 })
  async createBrand(
    @Body() request: CreateBoothBrandDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.createBrandWithHastags(
      request.getCreateProps(),
    );
    return ResponseEntity.CREATED('포토부스 업체를 생성 했습니다.');
  }

  @Get('brand/:id')
  @SwaggerAPI({
    name: '포토부스 업체 조회',
    response: GetBoothBrandDetailDto,
  })
  async findOneBrand(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetBoothBrandDetailDto>> {
    const response = await this.photoBoothService.findOneBrandById(id);
    return ResponseEntity.OK_WITH<GetBoothBrandDetailDto>(
      '요청한 포토부스 업체를 반환합니다.',
      new GetBoothBrandDetailDto(response),
    );
  }

  @Patch('brand/:id')
  @SwaggerAPI({ name: '포토부스 업체 수정' })
  async updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateBoothBrandDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.updateBrandWithHastags(
      id,
      request.getUpdateProps(),
    );
    return ResponseEntity.OK('포토부스 업체를 업데이트 했습니다.');
  }
}
