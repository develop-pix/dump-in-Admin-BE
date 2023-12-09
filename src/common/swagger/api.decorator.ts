import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  GetPhotoBoothDetailDto,
  GetBoothBrandDetailDto,
} from '../../photo-booth/dto/get-photo-booth-detail.dto';
import { ResponseEntity } from '../entity/response.entity';
import { GetEventDetailDto } from '../../event/dto/get-event-detail.dto';
import {
  GetBoothBrandListDto,
  GetPhotoBoothListDto,
} from '../../photo-booth/dto/get-photo-booth-list.dto';
import { GetEventListDto } from '../../event/dto/get-event-list.dto';
import { GetHashtagListDto } from '../../hashtag/dto/get-hastag-list.dto';
import { GetReviewListDto } from '../../review/dto/get-review-list.dto';
import { GetReviewDetailDto } from '../../review/dto/get-review-detail.dto';
import { GetUserDto } from '../../user/dto/get-user.dto';

export type Dtos =
  | GetPhotoBoothDetailDto
  | GetBoothBrandDetailDto
  | GetEventDetailDto
  | GetPhotoBoothListDto
  | GetBoothBrandListDto
  | GetEventListDto
  | GetHashtagListDto
  | ResponseEntity<string>
  | GetReviewListDto
  | GetReviewDetailDto
  | GetUserDto;

interface OptionsProps {
  name: string;
  response?: Type<Dtos>;
  status?: number;
  isArray?: boolean;
}

export const SwaggerAPI = ({
  name,
  response,
  status = HttpStatus.OK,
  isArray = false,
}: OptionsProps): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: `${name} API`,
    }),

    ApiResponse({
      status,
      isArray,
      type: response || ResponseEntity,
      description: isArray
        ? '성공 시 OK 응답과 목록과 페이지를 반환합니다.'
        : '성공 시 OK 응답을 반환합니다.',
    }),

    ApiNotFoundResponse({
      description:
        '실패 시 응답입니다. 404 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          {
            properties: {
              code: { enum: [HttpStatus.NOT_FOUND] },
              message: {
                type: 'string',
              },
              success: {
                type: 'boolean',
                example: false,
              },
              data: {
                type: 'string',
                example: '',
              },
            },
          },
        ],
      },
    }),
  );
