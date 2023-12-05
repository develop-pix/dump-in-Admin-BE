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
import { BoothQueryDto, BrandQueryDto } from './dto/get-photo-booth-query.dto';
import { Page } from '../common/dto/paginated-res.dto';
import {
  GetBoothBrandDetailDto,
  GetPhotoBoothDetailDto,
} from './dto/get-photo-booth-detail.dto';
import {
  UpdateBoothBrandDto,
  UpdatePhotoBoothDto,
} from './dto/patch-photo-booth.dto';
import { CreateBrandDto } from './dto/post-photo-booth.dto';
import { MoveHiddenToOpenBoothDto } from './dto/put-photo-booth.dto';

@ApiTags('포토부스')
@Controller('photo-booth')
export class PhotoBoothController {
  constructor(private readonly photoBoothService: PhotoBoothService) {}

  @Get()
  async findOpenBoothByQueryParam(
    @Query() request: BoothQueryDto,
  ): Promise<ResponseEntity<Page<GetPhotoBoothListDto>>> {
    const response = await this.photoBoothService.findOpenBoothByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<Page<GetPhotoBoothListDto>>(
      '공개된 포토부스 목록을 반환합니다.',
      response,
    );
  }

  @Get(':id')
  async findOneOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<GetPhotoBoothDetailDto>> {
    const response = await this.photoBoothService.findOneOpenBooth(id);
    return ResponseEntity.OK_WITH<GetPhotoBoothDetailDto>(
      '공개된 포토부스 목록을 반환합니다.',
      response,
    );
  }

  @Patch(':id')
  async updateOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdatePhotoBoothDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.updateOpenBooth(id, request.getUpdateProps());
    return ResponseEntity.OK('공개된 포토부스 지점을 업데이트 했습니다.');
  }

  @Delete(':id')
  async deleteOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.deleteOpenBooth(id);
    return ResponseEntity.OK('공개된 포토부스 지점을 삭제 했습니다.');
  }

  @Get('raw')
  async findHiddenBoothByQueryParam(
    @Query() request: BoothQueryDto,
  ): Promise<ResponseEntity<Page<GetPhotoBoothListDto>>> {
    const response = await this.photoBoothService.findHiddenBoothByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<Page<GetPhotoBoothListDto>>(
      '공개되지 않은 포토부스 목록을 반환합니다.',
      response,
    );
  }

  @Get('raw/:id')
  async findOneHiddenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<GetPhotoBoothDetailDto>> {
    const response = await this.photoBoothService.findOneHiddenBooth(id);
    return ResponseEntity.OK_WITH<GetPhotoBoothDetailDto>(
      '공개되지 않은 포토부스 목록을 반환합니다.',
      response,
    );
  }

  @Patch('raw/:id')
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
  async moveHiddenToOpenBooth(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: MoveHiddenToOpenBoothDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.moveHiddenToOpenBooth(
      id,
      request.getUpdateProps(),
    );
    return ResponseEntity.OK('비공개 포토부스를 이동 했습니다.');
  }

  @Delete('raw/:id')
  async deleteHiddenBooth(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.deleteHiddenBooth(id);
    return ResponseEntity.OK('비공개 포토부스를 삭제 했습니다.');
  }

  @Get('brand')
  async findBrandByQueryParam(
    @Query() request: BrandQueryDto,
  ): Promise<ResponseEntity<Page<GetBoothBrandListDto>>> {
    const response = await this.photoBoothService.findBrandByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<Page<GetBoothBrandListDto>>(
      '공개된 포토부스 목록을 반환합니다.',
      response,
    );
  }

  @Get('brand/:id')
  async findOneBrand(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetBoothBrandDetailDto>> {
    const response = await this.photoBoothService.findOneBrand(id);
    return ResponseEntity.OK_WITH<GetBoothBrandDetailDto>(
      '공개되지 않은 포토부스 목록을 반환합니다.',
      response,
    );
  }

  @Post('brand')
  async createBrand(
    @Body() request: CreateBrandDto,
  ): Promise<ResponseEntity<string>> {
    await this.photoBoothService.createBrandWithHastags(
      request.getCreateProps(),
    );
    return ResponseEntity.OK('포토부스 업체를 생성 했습니다.');
  }

  @Patch('brand/:id')
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
