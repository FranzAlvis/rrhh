import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UnidadOrganizacionalRepository } from '../repository/unidad-organizacional.repository'
import { CrearUnidadOrganizacionalDto } from '../dto/crear-unidad-organizacional.dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarUnidadOrganizacionalDto } from '../dto/actualizar-unidad-organizacional.dto'
import { EstadosOrganigramas, Status } from '../../../common/constants'
import { UnidadOrganizacional } from '../entity/unidad-organizacional.entity'
import { UnidadOrganizacionalAprobadoService } from './unidad-organizacional-aprobado.service'
import { UnidadOrganizacionalMessages } from 'src/common/constants/unidad.organizacional.messages'

@Injectable()
export class UnidadOrganizacionalService extends BaseService {
  constructor(
    @Inject(UnidadOrganizacionalRepository)
    private unidadOrganizacionalRepositorio: UnidadOrganizacionalRepository,
    private readonly unidadOrganizacionalAprobadoService: UnidadOrganizacionalAprobadoService
  ) {
    super()
  }

  async crear(
    unidadOrganizacionalDto: CrearUnidadOrganizacionalDto,
    usuarioAuditoria: string
  ) {
    return await this.unidadOrganizacionalRepositorio.crear(
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.unidadOrganizacionalRepositorio.listar(paginacionQueryDto)
  }

  async listarTodo(paginacionQueryDto: PaginacionQueryDto) {
    return await this.unidadOrganizacionalRepositorio.listarTodo(
      paginacionQueryDto
    )
  }

  async listarDependientes(idUnidadOrganizacional: string) {
    return await this.unidadOrganizacionalRepositorio.getDescendientes(
      idUnidadOrganizacional
    )
  }

  async arbolDeUnidadesOrganizacionales() {
    return await this.unidadOrganizacionalRepositorio.arbolDeUnidadesOrganizacionales()
  }

  async actualizarDatos(
    id: string,
    unidadOrganizacionalDto: ActualizarUnidadOrganizacionalDto,
    usuarioAuditoria: string
  ) {
    const unidadOrganizacional =
      await this.unidadOrganizacionalRepositorio.buscarPorId(+id)
    if (!unidadOrganizacional) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.unidadOrganizacionalRepositorio.actualizar(
      id,
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
    return { id }
  }

  async activar(idUnidadOrganizacional: string, usuarioAuditoria: string) {
    await this.unidadOrganizacionalRepositorio.buscarPorId(
      +idUnidadOrganizacional
    )
    const unidadOrganizacionalDto = new ActualizarUnidadOrganizacionalDto()
    unidadOrganizacionalDto.estado = Status.ACTIVE
    await this.unidadOrganizacionalRepositorio.actualizar(
      idUnidadOrganizacional,
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
    return {
      id: idUnidadOrganizacional,
      estado: unidadOrganizacionalDto.estado,
    }
  }

  async inactivar(idUnidadOrganizacional: string, usuarioAuditoria: string) {
    const unidadOrganizacional =
      await this.unidadOrganizacionalRepositorio.buscarPorId(
        +idUnidadOrganizacional
      )
    if (!unidadOrganizacional) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const unidadOrganizacionalDto = new ActualizarUnidadOrganizacionalDto()
    unidadOrganizacionalDto.estado = Status.INACTIVE
    await this.unidadOrganizacionalRepositorio.actualizar(
      idUnidadOrganizacional,
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
    return {
      id: idUnidadOrganizacional,
      estado: unidadOrganizacionalDto.estado,
    }
  }

  async eliminarNodoUnidadOrganizacional(idUnidadOrganizacional: string) {
    const unidadOrganizacional: UnidadOrganizacional | null =
      await this.unidadOrganizacionalRepositorio.buscarPorId(
        Number(idUnidadOrganizacional)
      )
    if (!unidadOrganizacional) {
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIZACIONTAL_UNIT_NOT_FOUND
      )
    }
    await this.unidadOrganizacionalRepositorio.eliminarNodoHijo(
      idUnidadOrganizacional
    )
    return idUnidadOrganizacional
  }

  async aprobarUnidadesOrganizacionales(
    idUnidadesOrganizacionales,
    usuarioAuditoria: string
  ) {
    for (const uo of idUnidadesOrganizacionales) {
      const unidadOrganizacional =
        await this.unidadOrganizacionalRepositorio.buscarPorId(
          +uo.idunidadorganizacional
        )
      if (unidadOrganizacional) {
        const unidadOrganizacionalDto: CrearUnidadOrganizacionalDto =
          this.armarUnidadOrganizacionalDto(unidadOrganizacional)
        await this.unidadOrganizacionalAprobadoService.crear(
          unidadOrganizacionalDto,
          usuarioAuditoria
        )
      }
    }
  }

  armarUnidadOrganizacionalDto(unidadOrganizacional: UnidadOrganizacional) {
    const unidadOrganizacionalDto: CrearUnidadOrganizacionalDto = {
      nombre: unidadOrganizacional.nombre,
      nivel: unidadOrganizacional.nivel,
      sigla: unidadOrganizacional.sigla,
      estado: EstadosOrganigramas.APROBADO,
      dependencia: unidadOrganizacional.dependencia,
    }
    return unidadOrganizacionalDto
  }
}
