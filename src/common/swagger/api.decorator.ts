import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Page } from '../dto/get-pagination-list.dto';
import { ResponseEntity } from '../entity/response.entity';
import { createSchema } from './api.schema';

export const SwaggerAPI = ({
  name,
  status = HttpStatus.OK,
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
            status: HttpStatus.NOT_FOUND,
            message: `${name} 요청에 실패했습니다.`,
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
      status,
      description: '성공 시 OK 응답을 반환합니다.',
      schema: {
        allOf: [
          createSchema({
            status,
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
  status?: number;
  isPagination?: boolean;
  model?: Type<unknown>;
}
