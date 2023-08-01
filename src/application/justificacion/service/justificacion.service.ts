import {
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { ApiProperty } from '@nestjs/swagger'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearJustificacionDto } from '../dto/crear-justificacion.dto'
import { Messages } from 'src/common/constants/response-messages'
import { Status } from 'src/common/constants'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JustificacionRepository } from '../repository/justificacion.repository'
import { PermisosMessages } from 'src/common/constants/permisos.messages'

@Injectable()
export class JustificacionService extends BaseService {
  constructor(
    @Inject(JustificacionRepository)
    private JustificacionRepository: JustificacionRepository
  ) {
    super()
  }

  @ApiProperty({ description: 'Listar las justificaciones' })
  async listar() {
    return await this.JustificacionRepository.listar()
  }

  @ApiProperty({ description: 'Listar todos las justificaciones' })
  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    return await this.JustificacionRepository.listarTodos(paginacionQueryDto)
  }

  @ApiProperty({ description: 'Crear justificaciones' })
  async crear(
    justificacionDto: CrearJustificacionDto,
    usuarioAuditoria: string
  ) {
    const { nombre } = justificacionDto

    const nombreFiltro = await this.JustificacionRepository.buscarPorNombre(
      nombre
    )

    if (nombreFiltro) {
      throw new PreconditionFailedException(PermisosMessages.NAME_DUPLICATE)
    }

    return await this.JustificacionRepository.crear(
      justificacionDto,
      usuarioAuditoria
    )
  }

  @ApiProperty({ description: 'Actualizar justificaciones' })
  async actualizar(
    id: string,
    justificacionDto: CrearJustificacionDto,
    usuarioAuditoria: string
  ) {
    const justificacion = await this.JustificacionRepository.buscarPorId(id)
    if (!justificacion) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const { nombre } = justificacionDto

    const nombreFiltro = await this.JustificacionRepository.buscarPorNombre(
      nombre
    )

    if (nombreFiltro) {
      throw new PreconditionFailedException(PermisosMessages.NAME_DUPLICATE)
    }

    await this.JustificacionRepository.actualizar(
      id,
      justificacionDto,
      usuarioAuditoria
    )
    return { id }
  }

  @ApiProperty({ description: 'Activar justificaciones' })
  async activar(idJustificacion: string, usuarioAuditoria: string) {
    const justificacion = await this.JustificacionRepository.buscarPorId(
      idJustificacion
    )
    if (!justificacion) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const justificacionDto = new CrearJustificacionDto()
    justificacionDto.estado = Status.ACTIVE
    await this.JustificacionRepository.actualizar(
      idJustificacion,
      justificacionDto,
      usuarioAuditoria
    )
    return { id: idJustificacion, estado: justificacionDto.estado }
  }

  @ApiProperty({ description: 'Inactivar justificaciones' })
  async inactivar(idJustificacion: string, usuarioAuditoria: string) {
    const justificacion = await this.JustificacionRepository.buscarPorId(
      idJustificacion
    )
    if (!justificacion) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const justificacionDto = new CrearJustificacionDto()
    justificacionDto.estado = Status.INACTIVE
    await this.JustificacionRepository.actualizar(
      idJustificacion,
      justificacionDto,
      usuarioAuditoria
    )
    return { id: idJustificacion, estado: justificacionDto.estado }
  }
}
