import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const SwaggerLogIn = (): MethodDecorator =>
  applyDecorators(
    ApiOperation({
      summary: '로그인 API',
      description:
        '로그인을 위한 API입니다. 응답 상태코드 반환하고 세션을 생성합니다.',
    }),

    ApiOkResponse({
      description:
        '로그인 성공 시 응답입니다. 200 상태코드와 함께 요청 성공 메시지가 반환됩니다',
      schema: {
        allOf: [
          {
            properties: {
              code: { enum: [HttpStatus.OK] },
              message: {
                type: 'string',
                example: '로그인 했습니다',
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

    ApiUnauthorizedResponse({
      description:
        '로그인 실패 시 응답입니다. 401 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          {
            properties: {
              code: { enum: [HttpStatus.UNAUTHORIZED] },
              message: {
                type: 'string',
                example:
                  '로그인에 실패했습니다. 아이디와 비밀번호를 다시 입력해주세요.',
              },
              success: { type: 'boolean', example: false },
              data: { type: 'string', example: '' },
            },
          },
        ],
      },
    }),

    ApiBadRequestResponse({
      description:
        '이미 로그인 했을 때 응답입니다. 400 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          {
            properties: {
              code: { enum: [HttpStatus.BAD_REQUEST] },
              success: { type: 'boolean', example: false },
              message: {
                type: 'string',
                example: '이미 로그인한 사용자입니다.',
              },
              data: { type: 'string', example: '' },
            },
          },
        ],
      },
    }),
  );
