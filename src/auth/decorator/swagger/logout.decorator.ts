import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const SwaggerLogOut = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: '아웃 API',
      description:
        '로그아웃 위한 API입니다. 응답 상태코드 반환하고 세션을 삭제합니다.',
    }),

    ApiOkResponse({
      description:
        '로그아웃 성공 시 응답입니다. 200 상태코드와 함께 성공 메시지가 반환됩니다',
      schema: {
        allOf: [
          {
            properties: {
              statusCode: { enum: [HttpStatus.OK] },
              message: {
                type: 'string',
                example: '로그아웃 했습니다',
              },
              success: { type: 'boolean', example: true },
              data: {
                type: 'string',
                example: '',
              },
            },
          },
        ],
      },
    }),

    ApiConflictResponse({
      description:
        '로그아웃 실패 시 응답입니다. 409 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          {
            properties: {
              statusCode: { enum: [HttpStatus.CONFLICT] },
              success: { type: 'boolean', example: false },
              message: {
                type: 'string',
                example: '로그아웃에 실패했습니다.',
              },
              data: { type: 'string', example: '' },
            },
          },
        ],
      },
    }),
  );
