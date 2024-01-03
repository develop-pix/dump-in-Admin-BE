import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { PhotoBoothRepository } from '../repository/photo-booth.repository';
import { PhotoBooth } from '../entity/photo-booth.entity';

@Injectable()
export class PhotoBoothPipe
  implements PipeTransform<string, Promise<PhotoBooth['id']>>
{
  constructor(private readonly photoBoothRepository: PhotoBoothRepository) {}

  async transform(value: PhotoBooth['id']) {
    const isPhotoBoothExist = this.photoBoothRepository.hasId(
      PhotoBooth.byId(value),
    );

    if (isPhotoBoothExist) {
      throw new ConflictException('이미 포토부스가 존재합니다.');
    }

    return value;
  }
}
