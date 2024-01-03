import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createSchema } from '../../common/swagger/api.schema';

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
          createSchema({
            status: HttpStatus.OK,
            message: '로그인 했습니다',
            success: true,
          }),
        ],
      },
    }),

    ApiUnauthorizedResponse({
      description:
        '로그인하지 않았을 때 응답입니다. 403 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          createSchema({
            status: HttpStatus.FORBIDDEN,
            message: '로그인이 필요합니다.',
            success: false,
          }),
        ],
      },
    }),

    ApiNotFoundResponse({
      description:
        '로그인 실패시 응답입니다. 404 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          createSchema({
            status: HttpStatus.NOT_FOUND,
            message: '관리자 정보를 찾지 못했습니다',
            success: false,
          }),
        ],
      },
    }),

    ApiBadRequestResponse({
      description:
        '이미 로그인 했을 때 응답입니다. 400 상태코드와 함께 요청 실패 메시지가 반환됩니다',
      schema: {
        allOf: [
          createSchema({
            status: HttpStatus.BAD_REQUEST,
            message: '이미 로그인한 사용자입니다.',
            success: false,
          }),
        ],
      },
    }),
  );
