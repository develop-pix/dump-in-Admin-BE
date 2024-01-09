import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { PhotoBoothService } from '../photo-booth.service';

/**
 * Validator supports service container in the case if want to inject dependencies into your custom validator constraint classes
 * @see also https://github.com/leosuncin/nest-api-example/blob/master/src/blog/pipes/article.pipe.ts
 * @see also https://github.com/typestack/class-validator?tab=readme-ov-file#using-service-container
 * @see also https://docs.nestjs.com/techniques/validation
 */
@Injectable()
export class PhotoBoothPipe
  implements PipeTransform<string, Promise<PhotoBooth['id']>>
{
  constructor(private readonly photoBoothRepository: PhotoBoothService) {}

  async transform(value: PhotoBooth['id']) {
    const isPhotoBoothExist = this.photoBoothRepository.hasPhotoBoothId(value);

    if (isPhotoBoothExist) {
      throw new ConflictException('이미 포토부스가 존재합니다.');
    }

    return value;
  }
}
