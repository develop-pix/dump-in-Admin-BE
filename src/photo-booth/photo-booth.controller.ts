import { Controller, Get, Patch, Param, Delete, Query } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('포토부스')
@Controller('photo-booth')
export class PhotoBoothController {
  constructor(private readonly photoBoothService: PhotoBoothService) { }

  @Get()
  async findAllBooth() {
  }

  @Get()
  async findBoothByQuery(@Query() request) {
  }

  @Get(':id')
  async findOneBooth(@Param('id') id: string) {
  }

  @Patch(':id')
  async updateBooth(@Param('id') id: string) {
  }

  @Delete(':id')
  async deleteBooth(@Param('id') id: string) {
  }

  @Get('brand')
  async findAllBrand() {
  }

  @Get('brand/:id')
  async findOneBrand(@Param('id') id: string) {
  }

  @Patch('brand/:id')
  async updateBrand(@Param('id') id: string) {
  }
}
