import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { SwaggerAPI } from '../common/swagger/api.decorator';
import { UpdateBoothBrandDto } from '../photo-booth/dto/patch-photo-booth.dto';
import { CreateBoothBrandDto } from './dto/post-brand.dto';
import { PhotoBoothBrand } from './entity/brand.entity';
import { GetBoothBrandDetailDto } from './dto/get-brand-detail.dto';
import { GetBoothBrandListDto } from './dto/get-brand-list.dto';
import { BoothBrandQueryDto } from './dto/get-brand-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('포토부스 업체')
@Controller('photo-booth/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @SwaggerAPI({
    name: '포토부스 업체 목록 조회',
    model: GetBoothBrandListDto,
    isPagination: true,
  })
  async findBrandByQueryParam(
    @Query() request: BoothBrandQueryDto,
  ): Promise<ResponseEntity<PageEntity<GetBoothBrandListDto>>> {
    const [response, count] = await this.brandService.findBrandByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<PageEntity<GetBoothBrandListDto>>(
      '포토부스 업체 목록을 반환합니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map(
          (entity: PhotoBoothBrand) => new GetBoothBrandListDto(entity),
        ),
      ),
    );
  }

  @Post()
  @SwaggerAPI({ name: '포토부스 업체 생성', success: 201 })
  async createBrand(
    @Body() request: CreateBoothBrandDto,
  ): Promise<ResponseEntity<string>> {
    await this.brandService.createBrandWithHastags(request.getCreateProps());
    return ResponseEntity.CREATED('포토부스 업체를 생성 했습니다.');
  }

  @Get(':id')
  @SwaggerAPI({
    name: '포토부스 업체 조회',
    model: GetBoothBrandDetailDto,
  })
  async findOneBrand(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetBoothBrandDetailDto>> {
    const response = await this.brandService.findOneBrandById(id);
    return ResponseEntity.OK_WITH<GetBoothBrandDetailDto>(
      '요청한 포토부스 업체를 반환합니다.',
      new GetBoothBrandDetailDto(response),
    );
  }

  @Patch(':id')
  @SwaggerAPI({ name: '포토부스 업체 수정' })
  async updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateBoothBrandDto,
  ): Promise<ResponseEntity<string>> {
    await this.brandService.updateBrandWithHastags(
      id,
      request.getUpdateProps(),
    );
    return ResponseEntity.OK('포토부스 업체를 업데이트 했습니다.');
  }
}
