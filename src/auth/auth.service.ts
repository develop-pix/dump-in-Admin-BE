import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  create(): string {
    return 'This action adds a new auth';
  }

  findAll(): string {
    return `This action returns all auth`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} auth`;
  }

  update(id: number): string {
    return `This action updates a #${id} auth`;
  }

  remove(id: number): string {
    return `This action removes a #${id} auth`;
  }
}
