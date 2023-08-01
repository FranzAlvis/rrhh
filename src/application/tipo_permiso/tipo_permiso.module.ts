import { Module } from '@nestjs/common'
import { TipoPermisoService } from './service/tipo_permiso.service'
import { TipoPermisoController } from './controller/tipo_permiso.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TipoPermisoRepository } from './repository/tipo_permiso.repository'

@Module({
  imports: [TypeOrmModule.forFeature([TipoPermisoController])],
  controllers: [TipoPermisoController],
  providers: [TipoPermisoService, TipoPermisoRepository],
})
export class TipoPermisoModule {}
