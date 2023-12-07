import { Injectable } from '@nestjs/common';

@Injectable()
export class HashtagService {
  create() {
    return 'This action adds a new hashtag';
  }

  findAll() {
    return `This action returns all hashtag`;
  }
}
