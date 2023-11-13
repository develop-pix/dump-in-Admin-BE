import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('포토부스')
@Controller('photo-booth')
export class PhotoBoothController {
  constructor(private readonly photoBoothService: PhotoBoothService) {}

  @Post()
  create() {
    return this.photoBoothService.create();
  }

  @Get()
  findAll() {
    return this.photoBoothService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoBoothService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.photoBoothService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoBoothService.remove(+id);
  }
}
