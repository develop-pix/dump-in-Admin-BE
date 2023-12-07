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

type DetailDtos =
  | GetPhotoBoothDetailDto
  | GetBoothBrandDetailDto
  | GetEventDetailDto;

export const SwaggerAPI = (
  name: string,
  status: number = HttpStatus.OK,
  response?: Type<DetailDtos>,
): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: `${name} API`,
    }),

    ApiResponse({
      status,
      type: response || ResponseEntity,
      description: '성공 시 OK 응답을 반환합니다.',
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