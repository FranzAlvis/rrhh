import { Module } from '@nestjs/common'
import { UnidadOrganizacionalController } from './controller/unidad-organizacional.controller'
import { AsignacionDePuestosController } from './controller/asignacion-de-puestos.controller'
import { UnidadOrganizacionalService } from './service/unidad-organizacional.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UnidadOrganizacionalRepository } from './repository/unidad-organizacional.repository'
import { UnidadOrganizacional } from './entity/unidad-organizacional.entity'
import { AsignacionDePuestosRepository } from './repository/asignacion-de-puestos.repository'
import { AsignacionDePuestos } from './entity/asignacion-de-puestos.entity'
import { EntidadesController } from './controller/entidades.controller'
import { EntidadRepository } from './repository/entidad.repository'
import { EntidadesService } from './service/entidades.service'
import { EscalaSalarialService } from './service/escala-salarial.service'
import { EscalaSalarialRepository } from './repository/escala-salarial.repository'
import { EscalaSalarialController } from './controller/escala-salarial.controller'
import { OrganigramaController } from './controller/organigrama.controller'
import { OrganigramaService } from './service/organigrama.service'
import { OrganigramaRepository } from './repository/organigrama.repository'
import { AsignacionDePuestosService } from './service/asignacion-de-puestos.service'
import { Organigrama } from './entity/organigrama.entity'
import { UnidadOrganizacionalAprobadoController } from './controller/unidad-organizacional-aprobado.controller'
import { UnidadOrganizacionalAprobadoService } from './service/unidad-organizacional-aprobado.service'
import { UnidadOrganizacionalAprobadoRepository } from './repository/unidad-organizacional-aprobado.repository'
import { UnidadOrganizacionalAprobado } from './entity/unidad-organizacional-aprobado.entity'
import { EscalaSalarialAprobadoController } from './controller/escala-salarial-aprobado.controller'
import { EscalaSalarialAprobadoService } from './service/escala-salarial-aprobado.service'
import { EscalaSalarialAprobadoRepository } from './repository/escala-salarial-aprobado.repository'
import { EscalaSalarialAprobado } from './entity/escala-salarial-aprobado.entity'
import { AsignacionPuestosAprobadoController } from './controller/asignacion-puestos-aprobado.controller'
import { AsignacionPuestosAprobadoService } from './service/asignacion-puestos-aprobado.service'
import { AsignacionPuestosAprobadoRepository } from './repository/asignacion-puestos-aprobado.repository'
import { AsignacionPuestosAprobado } from './entity/asignacion-puestos-aprobado.entity'
import { UsuarioAsignacionPuesto } from './entity/usuario-asignacion-puesto.entity'

@Module({
  controllers: [
    UnidadOrganizacionalController,
    AsignacionDePuestosController,
    EntidadesController,
    EscalaSalarialController,
    OrganigramaController,
    UnidadOrganizacionalAprobadoController,
    EscalaSalarialAprobadoController,
    AsignacionPuestosAprobadoController,
  ],
  providers: [
    UnidadOrganizacionalService,
    UnidadOrganizacionalRepository,
    AsignacionDePuestosService,
    AsignacionDePuestosRepository,
    EntidadesService,
    EntidadRepository,
    EscalaSalarialService,
    EscalaSalarialRepository,
    OrganigramaService,
    OrganigramaRepository,
    UnidadOrganizacionalAprobadoService,
    UnidadOrganizacionalAprobadoRepository,
    EscalaSalarialAprobadoService,
    EscalaSalarialAprobadoRepository,
    AsignacionPuestosAprobadoService,
    AsignacionPuestosAprobadoRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UnidadOrganizacional,
      AsignacionDePuestos,
      Organigrama,
      UnidadOrganizacionalAprobado,
      EscalaSalarialAprobado,
      AsignacionPuestosAprobado,
      UsuarioAsignacionPuesto,
    ]),
  ],
})
export class EstructuraOrganizacionalModule {}
