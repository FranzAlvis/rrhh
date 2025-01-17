import { AppController } from './app.controller'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ScheduleModule } from '@nestjs/schedule'
import { CoreModule } from './core/core.module'
import { ApplicationModule } from './application/application.module'
import { LoggerModule } from './core/logger/logger.module'
import { QueryErrorsInterceptor } from './common/interceptors/query.errors.interceptor'
@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CoreModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: QueryErrorsInterceptor,
    },
  ],
})
export class AppModule {}
