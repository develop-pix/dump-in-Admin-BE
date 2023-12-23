import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus';
import * as Sentry from '@sentry/node';
import { ResponseEntity } from './common/entity/response.entity';

@ApiTags('헬스체크')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async readiness(): Promise<ResponseEntity<HealthCheckResult>> {
    // 🟡 Notify Sentry your job is running:
    const checkInId = Sentry.captureCheckIn({
      monitorSlug: 'health-check',
      status: 'in_progress',
    });

    const result = await this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
    ]);

    // 🟢 Notify Sentry your job has completed successfully:
    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: 'health-check',
      status: 'ok',
    });
    return ResponseEntity.OK_WITH<HealthCheckResult>(
      '헬스 체크 결과 입니다.',
      result,
    );
  }
}
