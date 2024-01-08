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
import { CreateBrand } from './dto/post-brand.dto';
import { PhotoBoothBrand } from './entity/brand.entity';
import { GetBrandDetail } from './dto/get-brand-detail.dto';
import { GetBrandList } from './dto/get-brand-list.dto';
import { BrandQueryParam } from './dto/req-brand-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBrand } from './dto/patch-brand.dto';

@ApiTags('포토부스 업체')
@Controller('photo-booth/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @SwaggerAPI({
    name: '포토부스 업체 목록 조회',
    model: GetBrandList,
    isPagination: true,
  })
  async findBrandByQueryParam(
    @Query() request: BrandQueryParam,
  ): Promise<ResponseEntity<PageEntity<GetBrandList>>> {
    const [response, count] = await this.brandService.findBrandByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<PageEntity<GetBrandList>>(
      '포토부스 업체 목록을 반환합니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map((entity: PhotoBoothBrand) => new GetBrandList(entity)),
      ),
    );
  }

  @Post()
  @SwaggerAPI({ name: '포토부스 업체 생성', success: 201 })
  async createBrand(
    @Body() request: CreateBrand,
  ): Promise<ResponseEntity<string>> {
    await this.brandService.createBrandWithHastags(request.toCreateEntity());
    return ResponseEntity.CREATED('포토부스 업체를 생성 했습니다.');
  }

  @Get(':id')
  @SwaggerAPI({
    name: '포토부스 업체 조회',
    model: GetBrandDetail,
  })
  async findOneBrand(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetBrandDetail>> {
    const response = await this.brandService.findOneBrandById(id);
    return ResponseEntity.OK_WITH<GetBrandDetail>(
      '요청한 포토부스 업체를 반환합니다.',
      new GetBrandDetail(response),
    );
  }

  @Patch(':id')
  @SwaggerAPI({ name: '포토부스 업체 수정' })
  async updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateBrand,
  ): Promise<ResponseEntity<string>> {
    await this.brandService.updateBrandWithHastags(
      id,
      request.toUpdateEntity(),
    );
    return ResponseEntity.OK('포토부스 업체를 업데이트 했습니다.');
  }
}
