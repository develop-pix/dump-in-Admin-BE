import { Test, TestingModule } from '@nestjs/testing';
import { PhotoBoothController } from './photo-booth.controller';
import { PhotoBoothService } from './photo-booth.service';
import { GetPhotoBoothList } from './dto/get-photo-booth-list.dto';
import { GetPhotoBoothDetail } from './dto/get-photo-booth-detail.dto';
import { BoothQueryParam } from './dto/req-photo-booth-query.dto';
import { PhotoBooth } from './entity/photo-booth.entity';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { HttpStatus } from '@nestjs/common';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { UpdatePhotoBooth } from './dto/patch-photo-booth.dto';
import { MoveHiddenToOpenBooth } from './dto/put-photo-booth.dto';

class MockPhotoBoothService {
  findOpenBoothByQueryParam = jest.fn();
  findHiddenBoothByQueryParam = jest.fn();
  findOneHiddenBooth = jest.fn();
  updateHiddenBooth = jest.fn();
  moveHiddenToOpenBooth = jest.fn();
  deleteHiddenBooth = jest.fn();
  findOneOpenBooth = jest.fn();
  updateOpenBooth = jest.fn();
  deleteOpenBooth = jest.fn();
}

describe('PhotoBoothController', () => {
  let photoBoothController: PhotoBoothController;
  let photoBoothService: PhotoBoothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoBoothController],
      providers: [
        { provide: PhotoBoothService, useClass: MockPhotoBoothService },
      ],
    }).compile();

    photoBoothController =
      module.get<PhotoBoothController>(PhotoBoothController);
    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);
  });

  it('should be defined', () => {
    expect(photoBoothController).toBeDefined();
    expect(photoBoothService).toBeDefined();
  });

  describe('findOpenBoothByQueryParam', () => {
    it('SUCCESS: 공개된 포토부스 지점 목록 조회', async () => {
      const request: BoothQueryParam = new BoothQueryParam();
      const response = [new PhotoBooth()];
      const count: number = 0;

      jest
        .spyOn(photoBoothService, 'findOpenBoothByQueryParam')
        .mockResolvedValue([response, count]);

      const result =
        await photoBoothController.findOpenBoothByQueryParam(request);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<PageEntity<GetPhotoBoothList>>(
          expect.any(String),
          expect.any(PageEntity<GetPhotoBoothList>),
        ),
      );
      expect(photoBoothService.findOpenBoothByQueryParam).toHaveBeenCalledWith(
        request.getPageProps(),
        request.getQueryProps(),
      );
    });
  });

  describe('findHiddenBoothByQueryParam', () => {
    it('SUCCESS: 공개되지 않은 포토부스 지점 목록 조회', async () => {
      const request: BoothQueryParam = new BoothQueryParam();
      const response = [new HiddenPhotoBooth()];
      const count: number = 0;

      jest
        .spyOn(photoBoothService, 'findHiddenBoothByQueryParam')
        .mockResolvedValue([response, count]);

      const result =
        await photoBoothController.findHiddenBoothByQueryParam(request);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<PageEntity<GetPhotoBoothList>>(
          expect.any(String),
          expect.any(PageEntity<GetPhotoBoothList>),
        ),
      );
      expect(
        photoBoothService.findHiddenBoothByQueryParam,
      ).toHaveBeenCalledWith(request.getPageProps(), request.getQueryProps());
    });
  });

  describe('findOneHiddenBooth', () => {
    it('SUCCESS: 요청한 ID로 공개되지 않은 포토부스 지점 조회', async () => {
      const id: string = '123';
      const response = new HiddenPhotoBooth();

      jest
        .spyOn(photoBoothService, 'findOneHiddenBooth')
        .mockResolvedValue(response);

      const result = await photoBoothController.findOneHiddenBooth(id);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<GetPhotoBoothDetail>(
          expect.any(String),
          expect.any(GetPhotoBoothDetail),
        ),
      );
      expect(photoBoothService.findOneHiddenBooth).toHaveBeenCalledWith(id);
    });
  });

  describe('updateHiddenBooth', () => {
    it('SUCCESS: 요청한 ID로 공개되지 않은 포토부스 지점 수정', async () => {
      const id: string = '123';
      const request: UpdatePhotoBooth = new UpdatePhotoBooth();

      const result = await photoBoothController.updateHiddenBooth(id, request);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
      expect(photoBoothService.updateHiddenBooth).toHaveBeenCalledWith(
        id,
        request.toUpdateEntity(),
      );
    });
  });

  describe('moveHiddenToOpenBooth', () => {
    it('SUCCESS: 요청한 ID로 공개되지 않은 포토부스 지점을 공개로 전환', async () => {
      const id: string = '123';
      const request: MoveHiddenToOpenBooth = new MoveHiddenToOpenBooth();

      const result = await photoBoothController.moveHiddenToOpenBooth(
        id,
        request,
      );

      expect(result.code).toEqual(HttpStatus.CREATED);
      expect(result).toEqual(ResponseEntity.CREATED(expect.any(String)));
      expect(photoBoothService.moveHiddenToOpenBooth).toHaveBeenCalledWith(
        id,
        request.toMoveEntity(),
      );
    });
  });

  describe('deleteHiddenBooth', () => {
    it('SUCCESS: 요청한 ID로 공개되지 않은 포토부스 지점을 삭제 (soft)', async () => {
      const id: string = '123';

      const result = await photoBoothController.deleteHiddenBooth(id);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
      expect(photoBoothService.deleteHiddenBooth).toHaveBeenCalledWith(id);
    });
  });

  describe('findOneOpenBooth', () => {
    it('SUCCESS: 요청한 ID로 공개된 포토부스 지점을 조회', async () => {
      const id: string = '123';
      const response = new PhotoBooth();

      jest
        .spyOn(photoBoothService, 'findOneOpenBooth')
        .mockResolvedValue(response);

      const result = await photoBoothController.findOneOpenBooth(id);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<GetPhotoBoothDetail>(
          expect.any(String),
          expect.any(GetPhotoBoothDetail),
        ),
      );
      expect(photoBoothService.findOneOpenBooth).toHaveBeenCalledWith(id);
    });
  });

  describe('updateOpenBooth', () => {
    it('SUCCESS: 요청한 ID로 공개된 포토부스 지점을 수정', async () => {
      const id: string = '123';
      const request: UpdatePhotoBooth = new UpdatePhotoBooth();

      const result = await photoBoothController.updateOpenBooth(id, request);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
      expect(photoBoothService.updateOpenBooth).toHaveBeenCalledWith(
        id,
        request.toUpdateEntity(),
      );
    });
  });

  describe('deleteOpenBooth', () => {
    it('SUCCESS: 요청한 ID로 공개된 포토부스 지점을 삭제', async () => {
      const id: string = '123';

      const result = await photoBoothController.deleteOpenBooth(id);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
      expect(photoBoothService.deleteOpenBooth).toHaveBeenCalledWith(id);
    });
  });
});
