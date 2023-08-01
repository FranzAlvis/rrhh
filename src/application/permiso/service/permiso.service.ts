import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { PermisoRepository } from '../repository/permiso.repository'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearPermisoDto } from '../dto/crear-permiso.dto'
import { Messages } from 'src/common/constants/response-messages'
import { Status } from 'src/common/constants'
import { PermisosMessages } from 'src/common/constants/permisos.messages'

@Injectable()
export class PermisoService extends BaseService {
  constructor(
    @Inject(PermisoRepository)
    private permisoRepository: PermisoRepository
  ) {
    super()
  }
  async listar() {
    return await this.permisoRepository.listar()
  }

  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    return await this.permisoRepository.listarTodos(paginacionQueryDto)
  }

  async crear(permisoDto: CrearPermisoDto, usuarioAuditoria: string) {
    const { fechaInicio, fechaFin, horaInicio, horaFin } = permisoDto
    if (fechaInicio > fechaFin) {
      throw new NotFoundException(PermisosMessages.FECHA_INCORRECTA)
    }

    if (fechaInicio === fechaFin && horaInicio > horaFin) {
      throw new NotFoundException(PermisosMessages.HORA_INCORRECTA)
    }
    return await this.permisoRepository.crear(permisoDto, usuarioAuditoria)
  }

  async actualizar(
    id: string,
    permisoDto: CrearPermisoDto,
    usuarioAuditoria: string
  ) {
    const permiso = await this.permisoRepository.buscarPorId(id)
    if (!permiso) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const { fechaInicio, fechaFin, horaInicio, horaFin } = permisoDto
    if (fechaInicio > fechaFin) {
      throw new NotFoundException(PermisosMessages.FECHA_INCORRECTA)
    }

    if (fechaInicio === fechaFin && horaInicio > horaFin) {
      throw new NotFoundException(PermisosMessages.HORA_INCORRECTA)
    }

    await this.permisoRepository.actualizar(id, permisoDto, usuarioAuditoria)
    return { id }
  }

  async activar(idPermiso: string, usuarioAuditoria: string) {
    const permiso = await this.permisoRepository.buscarPorId(idPermiso)
    if (!permiso) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const permisoDto = new CrearPermisoDto()
    permisoDto.estado = Status.ACTIVE
    await this.permisoRepository.actualizar(
      idPermiso,
      permisoDto,
      usuarioAuditoria
    )
    return { id: idPermiso, estado: permisoDto.estado }
  }

  async inactivar(idPermiso: string, usuarioAuditoria: string) {
    const permiso = await this.permisoRepository.buscarPorId(idPermiso)
    if (!permiso) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const permisoDto = new CrearPermisoDto()
    permisoDto.estado = Status.INACTIVE
    await this.permisoRepository.actualizar(
      idPermiso,
      permisoDto,
      usuarioAuditoria
    )
    return { id: idPermiso, estado: permisoDto.estado }
  }
}
