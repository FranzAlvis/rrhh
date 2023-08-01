import { Module } from '@nestjs/common'
import { FeriadosService } from './service/feriados.service'
import { FeriadosController } from './controller/feriados.controller'
import { FeriadosRepository } from './repository/feriados.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Feriados } from './entity/feriados.entity'

@Module({
  controllers: [FeriadosController],
  providers: [FeriadosService, FeriadosRepository],
  imports: [TypeOrmModule.forFeature([Feriados])],
})
export class FeriadosModule {}
