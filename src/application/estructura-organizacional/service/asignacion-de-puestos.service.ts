import { BaseService } from '../../../common/base/base-service'
import {
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import { AsignacionDePuestosRepository } from '../repository/asignacion-de-puestos.repository'
import { UnidadOrganizacionalRepository } from '../repository/unidad-organizacional.repository'
import { OrganigramaRepository } from '../repository/organigrama.repository'
import { CrearAsignacionDePuestosDto } from '../dto/crear-asignacion-de-puestos.dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarAsignacionDePuestosDto } from '../dto/actualizar-asignacion-de-puestos.dto'
import { EstadosOrganigramas, Status } from '../../../common/constants'
import { UnidadOrganizacional } from '../entity/unidad-organizacional.entity'
import { Organigrama } from '../entity/organigrama.entity'
import { UnidadOrganizacionalMessages } from 'src/common/constants/unidad.organizacional.messages'
import { EscalaSalarialRepository } from '../repository/escala-salarial.repository'
import { EscalaSalarial } from '../entity/escala-salarial.entity'
import { AsignacionPuestosAprobadoRepository } from '../repository/asignacion-puestos-aprobado.repository'
import { AsignacionPuestosAprobadoService } from './asignacion-puestos-aprobado.service'
import { AsignacionDePuestos } from '../entity/asignacion-de-puestos.entity'

@Injectable()
export class AsignacionDePuestosService extends BaseService {
  constructor(
    @Inject(AsignacionDePuestosRepository)
    private asignacionDePuestosRepositorio: AsignacionDePuestosRepository,
    private unidadOrganizacionalRepository: UnidadOrganizacionalRepository,
    private organigramaRepository: OrganigramaRepository,
    private escalaSalarialRepository: EscalaSalarialRepository,

    @Inject(AsignacionPuestosAprobadoRepository)
    private asignacionPuestosAprobado: AsignacionPuestosAprobadoRepository,
    private asignacionPuestosAprobadoService: AsignacionPuestosAprobadoService
  ) {
    super()
  }

  private async getUnidadOrganizacional(
    id: number
  ): Promise<UnidadOrganizacional | null> {
    const unidadOrganizacional =
      await this.unidadOrganizacionalRepository.buscarPorId(id)

    if (unidadOrganizacional) return unidadOrganizacional

    throw new PreconditionFailedException(
      UnidadOrganizacionalMessages.ORGANIZACIONTAL_UNIT_NOT_FOUND
    )
  }

  async getOrganigramaPorId(id: number): Promise<Organigrama | null> {
    const organigrama = await this.organigramaRepository.buscarPorId(id)
    if (organigrama) return organigrama

    throw new PreconditionFailedException(
      UnidadOrganizacionalMessages.ORGANIGRAMA_NOT_FOUND
    )
  }

  private async getEscalaSalarialPorId(
    id: number
  ): Promise<EscalaSalarial | null> {
    const escalaSalarial = await this.escalaSalarialRepository.buscarPorId(id)
    if (escalaSalarial) return escalaSalarial

    throw new PreconditionFailedException(
      UnidadOrganizacionalMessages.ESCALA_SALARIAL_NOT_FOUND
    )
  }

  async crear(
    asignacionDePuestosDto: CrearAsignacionDePuestosDto,
    usuarioAuditoria: string
  ) {
    const {
      idUnidadOrganizacional,
      idEscalaSalarial,
      idOrganigrama,
      cargo,
      nro_item,
    } = asignacionDePuestosDto

    const cargoExistente =
      await this.asignacionDePuestosRepositorio.obtenerCargos(cargo)

    const nroItemExistente =
      await this.asignacionDePuestosRepositorio.obtenerNroItems(nro_item)

    const unidadExistente =
      await this.asignacionDePuestosRepositorio.obtenerUnidadesOrganizacional(
        idUnidadOrganizacional
      )

    const idUnidad = unidadExistente?.idUnidadOrganizacional

    if (
      idUnidad === idUnidadOrganizacional &&
      cargoExistente?.cargo === cargo &&
      nroItemExistente?.nro_item === nro_item
    ) {
      throw new PreconditionFailedException(
        UnidadOrganizacionalMessages.DUPLICATE_NRO_ITEM_CARGO_UNIDAD_ORGANIZACIONAL
      )
    }

    if (idOrganigrama && idOrganigrama > 0) {
      await this.getOrganigramaPorId(idOrganigrama)
      asignacionDePuestosDto.idOrganigrama = idOrganigrama
    }

    if (idEscalaSalarial && idEscalaSalarial > 0) {
      await this.getEscalaSalarialPorId(idEscalaSalarial)
      asignacionDePuestosDto.idEscalaSalarial = idEscalaSalarial
    }

    if (idUnidadOrganizacional && idUnidadOrganizacional > 0) {
      await this.getUnidadOrganizacional(idUnidadOrganizacional)
      asignacionDePuestosDto.idUnidadOrganizacional = idUnidadOrganizacional
    }

    return await this.asignacionDePuestosRepositorio.crear(
      asignacionDePuestosDto,
      usuarioAuditoria
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto, idOrganigrama) {
    return await this.asignacionDePuestosRepositorio.listar(
      paginacionQueryDto,
      idOrganigrama
    )
  }

  async listarTodo(paginacionQueryDto: PaginacionQueryDto, idOrganigrama) {
    return await this.asignacionDePuestosRepositorio.listarTodo(
      paginacionQueryDto,
      idOrganigrama
    )
  }

  async listarUltimoItem() {
    return await this.asignacionDePuestosRepositorio.listarUltimoItem()
  }

  async actualizarDatos(
    id: string,
    asignacionDePuestosDto: ActualizarAsignacionDePuestosDto,
    usuarioAuditoria: string
  ) {
    const { idUnidadOrganizacional, idEscalaSalarial, idOrganigrama } = {
      ...asignacionDePuestosDto,
    }
    if (idOrganigrama && idOrganigrama > 0) {
      await this.getOrganigramaPorId(idOrganigrama)
      asignacionDePuestosDto.idOrganigrama = idOrganigrama
    }

    if (idEscalaSalarial && idEscalaSalarial > 0) {
      await this.getEscalaSalarialPorId(idEscalaSalarial)
      asignacionDePuestosDto.idEscalaSalarial = idEscalaSalarial
    }

    if (idUnidadOrganizacional && idUnidadOrganizacional > 0) {
      await this.getUnidadOrganizacional(idUnidadOrganizacional)
      asignacionDePuestosDto.idUnidadOrganizacional = idUnidadOrganizacional
    }

    const asignacionDePuestos =
      await this.asignacionDePuestosRepositorio.buscarPorId(id)
    if (!asignacionDePuestos) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.asignacionDePuestosRepositorio.actualizar(
      id,
      asignacionDePuestosDto,
      usuarioAuditoria
    )
    return { id }
  }

  async activar(idAsignacionDePuestos: string, usuarioAuditoria: string) {
    const asignacionDePuestos =
      await this.asignacionDePuestosRepositorio.buscarPorId(
        idAsignacionDePuestos
      )
    if (!asignacionDePuestos) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const asignacionDePuestosDto = new ActualizarAsignacionDePuestosDto()
    asignacionDePuestosDto.estado = Status.ACTIVE
    await this.asignacionDePuestosRepositorio.actualizar(
      idAsignacionDePuestos,
      asignacionDePuestosDto,
      usuarioAuditoria
    )
    return {
      id: idAsignacionDePuestos,
      estado: asignacionDePuestosDto.estado,
    }
  }

  async inactivar(idAsignacionDePuestos: string, usuarioAuditoria: string) {
    const asignacionDePuestos =
      await this.asignacionDePuestosRepositorio.buscarPorId(
        idAsignacionDePuestos
      )
    if (!asignacionDePuestos) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const asignacionDePuestosDto = new ActualizarAsignacionDePuestosDto()
    asignacionDePuestosDto.estado = Status.INACTIVE
    await this.asignacionDePuestosRepositorio.actualizar(
      idAsignacionDePuestos,
      asignacionDePuestosDto,
      usuarioAuditoria
    )
    return {
      id: idAsignacionDePuestos,
      estado: asignacionDePuestosDto.estado,
    }
  }

  async eliminarAsignacionDePuestos(IdAsignacionDePuestos: string) {
    await this.asignacionDePuestosRepositorio.eliminar(IdAsignacionDePuestos)
    return IdAsignacionDePuestos
  }

  async obtenerUnidadesOrganizacionales(idOrganigrama: string) {
    return await this.asignacionDePuestosRepositorio.obtenerUnidadesOrganizacionales(
      +idOrganigrama
    )
  }

  async obtenerEscalaSalarial(idOrganigrama: string) {
    return await this.asignacionDePuestosRepositorio.obtenerEscalasSalariales(
      +idOrganigrama
    )
  }

  async obtenerAsignacionesPuestos(idOrganigrama: string) {
    return await this.asignacionDePuestosRepositorio.obtenerAsignacionesPuestos(
      +idOrganigrama
    )
  }

  async aprobarAsignacionesPuesto(
    idAsignacionDePuestos: { asignacionpuesto_id: string }[],
    usuarioAuditoria: string
  ) {
    for (const ap of idAsignacionDePuestos) {
      const asignacionPuesto =
        await this.asignacionDePuestosRepositorio.buscarPorId(
          ap.asignacionpuesto_id
        )
      if (asignacionPuesto) {
        const asignacionPuestoDto: CrearAsignacionDePuestosDto =
          this.armarAsignacionPuestoDto(asignacionPuesto)
        await this.asignacionPuestosAprobadoService.crear(
          asignacionPuestoDto,
          usuarioAuditoria
        )
      }
    }
  }

  armarAsignacionPuestoDto(asignacionPuesto: AsignacionDePuestos) {
    const asignacionPuestoDto: CrearAsignacionDePuestosDto = {
      descripcion_puesto: asignacionPuesto.descripcion_puesto,
      nro_item: asignacionPuesto.nro_item,
      nivel: asignacionPuesto.nivel,
      cargo: asignacionPuesto.cargo,
      idUnidadOrganizacional: asignacionPuesto.idUnidadOrganizacional,
      idEscalaSalarial: asignacionPuesto.idEscalaSalarial,
      idOrganigrama: asignacionPuesto.idOrganigrama,
      estado: EstadosOrganigramas.APROBADO,
    }
    return asignacionPuestoDto
  }

  async listarAsignacionesPuestoPorGestionActual() {
    try {
      return await this.asignacionDePuestosRepositorio.listarAsignacionesPuestoPorGestionActual()
    } catch (error) {
      throw new Error(error)
    }
  }
}
