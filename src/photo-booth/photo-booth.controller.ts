import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('포토부스')
@Controller('photo-booth')
export class PhotoBoothController {
  constructor(private readonly photoBoothService: PhotoBoothService) {}

  @Get()
  findAllBooth() {
    return this.photoBoothService.findAllRawData();
  }

  @Get(':id')
  findOneBooth(@Param('id') id: string) {
    return this.photoBoothService.findOneRawData(+id);
  }

  @Patch(':id')
  updateBooth(@Param('id') id: string) {
    return this.photoBoothService.updateRawData(+id);
  }

  // @Delete(':id')
  // deleteBooth(@Param('id') id: string) {
  //   return this.photoBoothService.deleteBooth(+id);
  // }

  @Get('brand')
  findAllBrand() {
    return this.photoBoothService.findAll();
  }

  @Get('brand/:id')
  findOneBrand(@Param('id') id: string) {
    return this.photoBoothService.findOne(+id);
  }

  @Patch('brand/:id')
  updateBrand(@Param('id') id: string) {
    return this.photoBoothService.update(+id);
  }

  // @Delete(':id')
  // deleteBrand(@Param('id') id: string) {
  //   return this.photoBoothService.deleteBrand(+id);
  // }
}
