import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { ResponseEntity } from './common/entity/response.entity';
import { HttpStatus } from '@nestjs/common';

class MockHealthCheckService {
  check = jest.fn();
}

class MockTypeOrmHealthIndicator {
  pingCheck = jest.fn();
}

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;
  let typeOrmHealthIndicator: TypeOrmHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useClass: MockHealthCheckService },
        {
          provide: TypeOrmHealthIndicator,
          useClass: MockTypeOrmHealthIndicator,
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    typeOrmHealthIndicator = module.get<TypeOrmHealthIndicator>(
      TypeOrmHealthIndicator,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
    expect(healthCheckService).toBeDefined();
    expect(typeOrmHealthIndicator).toBeDefined();
  });

  describe('readiness', () => {
    it('SUCCESS: 헬스체크 성공', async () => {
      const mockResult: HealthCheckResult = {
        status: 'ok',
        details: { database: { status: 'up' } },
        info: {},
        error: {},
      };

      jest.spyOn(healthCheckService, 'check').mockResolvedValue(mockResult);

      const response = await healthController.readiness();

      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
      expect(response.code).toEqual(HttpStatus.OK);
      expect(response).toEqual(
        ResponseEntity.OK_WITH<HealthCheckResult>(
          expect.any(String),
          mockResult,
        ),
      );
    });
  });
});
