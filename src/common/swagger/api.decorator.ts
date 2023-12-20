import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Page } from '../dto/get-pagination-list.dto';
import { ResponseEntity } from '../entity/response.entity';
import { createSchema } from './api.schema';

export const SwaggerAPI = ({
  name,
  success = HttpStatus.OK,
  fail = HttpStatus.NOT_FOUND,
  model = Object,
  isPagination = false,
}: OptionsProps): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: `${name} API`,
    }),

    ApiExtraModels(Page, ResponseEntity, model),
    ApiNotFoundResponse({
      description:
        '실패 시 응답입니다. 404 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          createSchema({
            status: fail,
            message: `${name} 요청에 실패했습니다.`,
            success: false,
          }),
        ],
      },
    }),

    ApiTooManyRequestsResponse({
      description: '요청 횟수 초과 시 응답입니다. 429 상태코드가 반환됩니다',
      schema: {
        allOf: [
          createSchema({
            status: HttpStatus.TOO_MANY_REQUESTS,
            message: '요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.',
            success: false,
          }),
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description:
        '로그인하지 않았을 때 응답입니다. 401 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          createSchema({
            status: HttpStatus.UNAUTHORIZED,
            message: '로그인이 필요합니다.',
            success: false,
          }),
        ],
      },
    }),

    ApiResponse({
      status: success,
      description: '성공 시 OK 응답을 반환합니다.',
      schema: {
        allOf: [
          createSchema({
            status: success,
            message: `${name} 했습니다.`,
            success: true,
            data: isPagination
              ? {
                  $ref: getSchemaPath(Page),
                  properties: {
                    results: {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    },
                  },
                }
              : {
                  $ref: getSchemaPath(model),
                },
          }),
        ],
      },
    }),
  );
};

interface OptionsProps {
  name: string;
  success?: number;
  fail?: number;
  isPagination?: boolean;
  model?: Type<unknown>;
}
