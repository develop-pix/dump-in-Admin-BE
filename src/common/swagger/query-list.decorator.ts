import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  GetBoothBrandListDto,
  GetPhotoBoothListDto,
} from '../../photo-booth/dto/get-photo-booth-list.dto';
import { GetEventListDto } from '../../event/dto/get-event-list.dto';

type ListDtos = GetPhotoBoothListDto | GetBoothBrandListDto | GetEventListDto;

export const SwaggerListByQueryParam = (
  name: string,
  reponse: Type<ListDtos>,
): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: `${name} 목록 조회 API`,
    }),

    ApiResponse({
      status: 200,
      type: reponse,
      isArray: true,
      description: '성공 시 OK 응답과 목록과 페이지를 반환합니다.',
    }),

    ApiNotFoundResponse({
      description:
        '목록 조회 실패 시 응답입니다. 404 상태코드와 함께 요청 실패 메시지가 반환됩니다',
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
