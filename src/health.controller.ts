import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import * as Sentry from '@sentry/node';

@ApiTags('헬스체크')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): void {
    // 🟡 Notify Sentry your job is running:
    const checkInId = Sentry.captureCheckIn({
      monitorSlug: 'health-check',
      status: 'in_progress',
    });

    this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
    ]);

    // 🟢 Notify Sentry your job has completed successfully:
    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: 'health-check',
      status: 'ok',
    });
  }
}
