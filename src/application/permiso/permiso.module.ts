import { Module } from '@nestjs/common'
import { PermisoService } from './service/permiso.service'
import { PermisoController } from './controller/permiso.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permiso } from './entities/permiso.entity'
import { PermisoRepository } from './repository/permiso.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Permiso])],
  controllers: [PermisoController],
  providers: [PermisoService, PermisoRepository],
})
export class PermisoModule {}
