import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JustificacionController } from './controller/justificacion.controller'
import { JustificacionService } from './service/justificacion.service'
import { JustificacionRepository } from './repository/justificacion.repository'

@Module({
  imports: [TypeOrmModule.forFeature([JustificacionController])],
  controllers: [JustificacionController],
  providers: [JustificacionService, JustificacionRepository],
})
export class JustificacionModule {}
