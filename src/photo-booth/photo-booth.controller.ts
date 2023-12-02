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
} from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { ApiTags } from '@nestjs/swagger';
import { GetPhotoBoothListDto } from './dto/get-photo-booth-list.dto';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { BoothQueryDto } from './dto/get-photo-booth-query.dto';
import { Page } from '../common/dto/paginated-res.dto';
import { GetPhotoBoothDetailDto } from './dto/get-photo-booth-detail.dto';
import { UpdatePhotoBoothDto } from './dto/patch-photo-booth.dto';

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
    return ResponseEntity.OK('포토부스 업데이트를 업데이트 했습니다.');
  }

  @Delete(':id')
  async deleteOpenBooth() {}

  @Get('raw')
  async findHiddenBoothByQuery(
    @Query() request: BoothQueryDto,
  ): Promise<ResponseEntity<Page<GetPhotoBoothListDto>>> {
    const response = await this.photoBoothService.findOpenBoothByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<Page<GetPhotoBoothListDto>>(
      '공개되지 않은 포토부스 목록을 반환합니다.',
      response,
    );
  }

  @Get('raw/:id')
  async findOneHiddenBooth() {}

  @Put('raw/:id')
  async moveHiddenToOpenBooth() {}

  @Patch('raw/:id')
  async updateHiddenBooth() {}

  @Delete('raw/:id')
  async deleteHiddenBooth() {}

  @Post('brand')
  async createBrand() {}

  @Get('brand')
  async findAllBrand() {}

  @Get('brand/:id')
  async findOneBrand() {}

  @Patch('brand/:id')
  async updateBrand() {}
}
