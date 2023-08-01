import {
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { TipoPermisoRepository } from '../repository/tipo_permiso.repository'
import { ApiProperty } from '@nestjs/swagger'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearTipoPermisoDto } from '../dto/crear-tipo_permiso.dto'
import { Messages } from 'src/common/constants/response-messages'
import { Status } from 'src/common/constants'
import { PermisosMessages } from 'src/common/constants/permisos.messages'

@Injectable()
export class TipoPermisoService extends BaseService {
  constructor(
    @Inject(TipoPermisoRepository)
    private tipoPermisoRepository: TipoPermisoRepository
  ) {
    super()
  }

  @ApiProperty({ description: 'Listar los tipos de permisos' })
  async listar() {
    return await this.tipoPermisoRepository.listar()
  }

  @ApiProperty({
    description: 'Listar los tipos de permisos con sus justificaciones',
  })
  async obtenerJustificacionPorTipo(id: string) {
    return await this.tipoPermisoRepository.obtenerJustificacionPorTipo(id)
  }

  @ApiProperty({ description: 'Listar todos los tipos de permisos' })
  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    return await this.tipoPermisoRepository.listarTodos(paginacionQueryDto)
  }

  @ApiProperty({ description: 'Crear tipo de permiso' })
  async crear(tipoPermisoDto: CrearTipoPermisoDto, usuarioAuditoria: string) {
    const { sigla, nombre } = tipoPermisoDto

    const nombreFiltro = await this.tipoPermisoRepository.buscarPorNombre(
      nombre
    )

    if (nombreFiltro) {
      throw new PreconditionFailedException(PermisosMessages.NAME_DUPLICATE)
    }

    const tipoPermisoSigla = await this.tipoPermisoRepository.buscarPorSigla(
      sigla
    )

    if (tipoPermisoSigla) {
      throw new PreconditionFailedException(PermisosMessages.SIGLA_DUPLICATE)
    }

    return await this.tipoPermisoRepository.crear(
      tipoPermisoDto,
      usuarioAuditoria
    )
  }

  @ApiProperty({ description: 'Actualizar tipo de permiso' })
  async actualizar(
    id: string,
    tipoPermisoDto: CrearTipoPermisoDto,
    usuarioAuditoria: string
  ) {
    const tipoPermiso = await this.tipoPermisoRepository.buscarPorId(id)
    if (!tipoPermiso) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const { sigla, nombre } = tipoPermisoDto

    const nombreFiltro = await this.tipoPermisoRepository.buscarPorNombre(
      nombre
    )

    if (nombreFiltro) {
      throw new PreconditionFailedException(PermisosMessages.NAME_DUPLICATE)
    }

    const tipoPermisoSigla = await this.tipoPermisoRepository.buscarPorSigla(
      sigla
    )

    if (tipoPermisoSigla) {
      throw new PreconditionFailedException(PermisosMessages.SIGLA_DUPLICATE)
    }

    await this.tipoPermisoRepository.actualizar(
      id,
      tipoPermisoDto,
      usuarioAuditoria
    )
    return { id }
  }

  @ApiProperty({ description: 'Activar tipo de permiso' })
  async activar(idTipoPermiso: string, usuarioAuditoria: string) {
    const tipoPermiso = await this.tipoPermisoRepository.buscarPorId(
      idTipoPermiso
    )
    if (!tipoPermiso) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const tipoPermisoDto = new CrearTipoPermisoDto()
    tipoPermisoDto.estado = Status.ACTIVE
    await this.tipoPermisoRepository.actualizar(
      idTipoPermiso,
      tipoPermisoDto,
      usuarioAuditoria
    )
    return { id: idTipoPermiso, estado: tipoPermisoDto.estado }
  }

  @ApiProperty({ description: 'Inactivar tipo de permiso' })
  async inactivar(idTipoPermiso: string, usuarioAuditoria: string) {
    const tipoPermiso = await this.tipoPermisoRepository.buscarPorId(
      idTipoPermiso
    )
    if (!tipoPermiso) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const tipoPermisoDto = new CrearTipoPermisoDto()
    tipoPermisoDto.estado = Status.INACTIVE
    await this.tipoPermisoRepository.actualizar(
      idTipoPermiso,
      tipoPermisoDto,
      usuarioAuditoria
    )
    return { id: idTipoPermiso, estado: tipoPermisoDto.estado }
  }
}
