import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { AuthZManagementService } from 'nest-authz'
import { BaseService } from 'src/common/base/base-service'
import { OrganigramaRepository } from '../repository/organigrama.repository'
import { CrearOrganigramaDto } from '../dto/crear-organigrama.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ActualizarOrganigramaDto } from '../dto/actualizar-organigrama.dto'
import { Messages } from 'src/common/constants/response-messages'
import { AsignacionDePuestosService } from './asignacion-de-puestos.service'
import { UnidadOrganizacionalService } from './unidad-organizacional.service'
import { EscalaSalarialService } from './escala-salarial.service'
import { UnidadOrganizacionalMessages } from 'src/common/constants/unidad.organizacional.messages'
import { EstadosOrganigramas } from 'src/common/constants'

@Injectable()
export class OrganigramaService extends BaseService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    @Inject(OrganigramaRepository)
    private organigramaRepository: OrganigramaRepository,
    private readonly asignacionPuestosServices: AsignacionDePuestosService,
    private readonly unidadesOrganizacionalesServices: UnidadOrganizacionalService,
    private readonly escalasSalarialesServices: EscalaSalarialService
  ) {
    super()
  }

  async crear(organigramaDto: CrearOrganigramaDto, usuarioAuditoria: string) {
    const { gestion } = organigramaDto

    if (!organigramaDto) {
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIGRAMA_NOT_FOUND
      )
    }

    const existeGestion = await this.organigramaRepository.buscarGestion(
      gestion
    )

    if (existeGestion) {
      throw new NotFoundException(
        'Ya existe un organigrama con la misma gestion'
      )
    }

    return await this.organigramaRepository.crear(
      organigramaDto,
      usuarioAuditoria
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.organigramaRepository.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    organigramaDto: ActualizarOrganigramaDto,
    usuarioAuditoria: string
  ) {
    const { gestion } = organigramaDto
    const organigrama = await this.organigramaRepository.buscarPorId(+id)

    if (!organigrama) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const existeGestion = await this.organigramaRepository.buscarGestion(
      gestion
    )

    if (existeGestion && existeGestion.id !== id) {
      throw new NotFoundException(
        'Ya existe un organigrama con la misma gestion'
      )
    }
    await this.organigramaRepository.actualizar(
      id,
      organigramaDto,
      usuarioAuditoria
    )
    return { id }
  }

  async ultimoOrganigrama() {
    const organigrama = await this.organigramaRepository.ultimoOrganigrama()
    let respuesta_version = 0
    if (!organigrama) {
      respuesta_version++
    } else {
      const [version_mayor] = organigrama.version.split('.')
      respuesta_version = +version_mayor + 1
    }
    return { version: `${respuesta_version}` }
  }

  async aprobarOrganigrama(idOrganigrama: string, usuarioAuditoria: string) {
    const organigrama = await this.organigramaRepository.buscarPorId(
      +idOrganigrama
    )

    if (!organigrama) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const unidadesOrganizacionales =
      await this.asignacionPuestosServices.obtenerUnidadesOrganizacionales(
        idOrganigrama
      )
    await this.unidadesOrganizacionalesServices.aprobarUnidadesOrganizacionales(
      unidadesOrganizacionales,
      usuarioAuditoria
    )

    const escalasSalariales =
      await this.asignacionPuestosServices.obtenerEscalaSalarial(idOrganigrama)

    await this.escalasSalarialesServices.aprobarEscalasSalariales(
      escalasSalariales,
      usuarioAuditoria
    )

    const asignacionesPuestos =
      await this.asignacionPuestosServices.obtenerAsignacionesPuestos(
        idOrganigrama
      )

    await this.asignacionPuestosServices.aprobarAsignacionesPuesto(
      asignacionesPuestos,
      usuarioAuditoria
    )

    organigrama.estado = EstadosOrganigramas.APROBADO
    return await this.organigramaRepository.actualizar(
      idOrganigrama,
      organigrama,
      usuarioAuditoria
    )
  }

  async revisarOrganigrama(id: string, usuarioAuditoria: string) {
    const organigrama = await this.organigramaRepository.buscarPorId(+id)
    if (!organigrama) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const estadoActual = organigrama.estado
    if (estadoActual !== EstadosOrganigramas.ELABORACION) {
      throw new NotFoundException(
        `${UnidadOrganizacionalMessages.ORGANIZACIONTAL_NOT_ELABORACION}, estado: ${estadoActual}`
      )
    }
    organigrama.estado = EstadosOrganigramas.REVISION
    return await this.organigramaRepository.actualizar(
      id,
      organigrama,
      usuarioAuditoria
    )
  }

  async rechazarOrganigrama(idOrganigrama: string, usuarioAuditoria: string) {
    const organigrama = await this.organigramaRepository.buscarPorId(
      +idOrganigrama
    )

    if (!organigrama) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    if (organigrama.estado !== EstadosOrganigramas.REVISION) {
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIZACIONTAL_NOT_REVISION
      )
    }

    organigrama.estado = EstadosOrganigramas.RECHAZADO

    return await this.organigramaRepository.actualizar(
      idOrganigrama,
      organigrama,
      usuarioAuditoria
    )
  }

  async eliminar(idOrganigrama: string) {
    const organigrama = await this.organigramaRepository.buscarPorId(
      +idOrganigrama
    )
    if (!organigrama) {
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIGRAMA_NOT_FOUND
      )
    }

    const asignacionDePuestos =
      await this.asignacionPuestosServices.obtenerAsignacionesPuestos(
        idOrganigrama
      )
    if (asignacionDePuestos.length > 0) {
      console.log(asignacionDePuestos.length)
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIGRAMA_NOT_DELETE
      )
    }

    await this.organigramaRepository.eliminar(idOrganigrama)
  }
}
