import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/get-pagination-query.dto';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { GetUserDto } from './dto/get-user.dto';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { SwaggerAPI } from 'src/common/swagger/api.decorator';
import { User } from './entity/user.entity';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SwaggerAPI({ name: '유저 목록 조회', model: GetUserDto, isPagination: true })
  async findAllUser(
    @Query() request: PaginationDto,
  ): Promise<ResponseEntity<PageEntity<GetUserDto>>> {
    const [response, count] = await this.userService.findAllUser(
      request.getPageProps(),
    );
    return ResponseEntity.OK_WITH<PageEntity<GetUserDto>>(
      '유저 목록입니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map((result: User) => new GetUserDto(result)),
      ),
    );
  }
}
