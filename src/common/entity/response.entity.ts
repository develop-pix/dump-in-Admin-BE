import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly _code: HttpStatus;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _success: boolean;
  @Exclude() private readonly _data: T;

  constructor(code: HttpStatus, message: string, success: boolean, data: T) {
    this._code = code;
    this._message = message;
    this._success = success;
    this._data = data;
  }

  static OK(message: string): ResponseEntity<string> {
    return new ResponseEntity(HttpStatus.OK, message, true, '');
  }

  static OK_WITH<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, message, true, data);
  }

  static CREATED(message: string): ResponseEntity<string> {
    return new ResponseEntity(HttpStatus.CREATED, message, true, '');
  }

  static CREATED_WITH<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.CREATED, message, true, data);
  }

  @ApiProperty({
    description: '요청에 대한 응답 상태코드 필드입니다',
    enum: HttpStatus,
    example: HttpStatus.OK,
  })
  @Expose()
  get code(): HttpStatus {
    return this._code;
  }

  @ApiProperty({
    description: '요청에 대한 응답 메시지 필드 입니다',
    type: String,
    example: '요청에 성공하였습니다',
  })
  @Expose()
  get message(): string {
    return this._message;
  }

  @ApiProperty({
    description: '요청에 대한 성공 여부 필드 입니다',
    type: Boolean,
    example: true,
  })
  @Expose()
  get success(): boolean {
    return this._success;
  }

  @ApiProperty({
    description: '요청에 대한 데이터 필드 입니다',
    type: Object,
    required: false,
  })
  @Expose()
  get data(): T {
    return this._data;
  }
}
