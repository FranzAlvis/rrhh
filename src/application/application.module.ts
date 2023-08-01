import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { PermisoModule } from './permiso/permiso.module'
import { TipoPermisoModule } from './tipo_permiso/tipo_permiso.module'
import { EstructuraOrganizacionalModule } from './estructura-organizacional/estructura-organizacional.module'
import { JustificacionModule } from './justificacion/justificacion.module'
import { FeriadosModule } from './feriados/feriados.module'

@Module({
  imports: [
    ParametroModule,
    PermisoModule,
    TipoPermisoModule,
    JustificacionModule,
    ParametroModule,
    EstructuraOrganizacionalModule,
    FeriadosModule,
  ],
})
export class ApplicationModule {}
