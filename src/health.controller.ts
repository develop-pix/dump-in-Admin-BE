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
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('헬스체크')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Cron(CronExpression.EVERY_3_HOURS)
  async readiness(): Promise<ResponseEntity<HealthCheckResult>> {
    const result = await this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
    ]);
    Sentry.captureCheckIn({
      monitorSlug: 'server-health',
      status: result.status === 'ok' ? 'ok' : 'error',
    });
    return ResponseEntity.OK_WITH<HealthCheckResult>(
      '헬스 체크 결과입니다.',
      result,
    );
  }
}
