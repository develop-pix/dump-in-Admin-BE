import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const SwaggerLogOut = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: '로그아웃 API',
      description:
        '로그아웃 위한 API입니다. 응답 상태코드 반환하고 쿠키를 삭제합니다.',
    }),

    ApiOkResponse({
      description: '로그아웃 성공 시 응답입니다. 200 상태코드가 반환됩니다',
    }),

    ApiBadRequestResponse({
      description:
        '로그아웃 실패 시 응답입니다. 400 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          {
            properties: {
              code: { enum: [HttpStatus.BAD_REQUEST] },
              success: { type: 'boolean', example: false },
              message: {
                type: 'string',
                example: '잘못된 요청입니다.',
              },
              data: { type: 'string', example: '' },
            },
          },
        ],
      },
    }),
  );
