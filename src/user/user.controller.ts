import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/get-pagination-query.dto';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { GetUserDto } from './dto/get-user.dto';
import { Page } from '../common/dto/get-pagination-list.dto';
import { SwaggerAPI } from 'src/common/swagger/api.decorator';
import { AdminCheckGuard } from '../auth/guard/admin-check.guard';

@ApiTags('유저')
@Controller('user')
@UseGuards(AdminCheckGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SwaggerAPI({ name: '유저 목록 조회', response: GetUserDto, isArray: true })
  async findAllUser(
    @Query() request: PaginationDto,
  ): Promise<ResponseEntity<Page<GetUserDto>>> {
    const [response, count] = await this.userService.findAllUser(
      request.getPageProps(),
    );
    return ResponseEntity.OK_WITH<Page<GetUserDto>>(
      '유저 목록입니다.',
      Page.create(request.getPageProps(), count, response),
    );
  }
}
