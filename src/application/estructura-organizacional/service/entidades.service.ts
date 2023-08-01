import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CrearEntidadDto } from '../dto/crear-entidad.dto'
import { BaseService } from 'src/common/base/base-service'
import { EntidadRepository } from '../repository/entidad.repository'
import { AuthZManagementService } from 'nest-authz'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ActualizarEntidadDto } from '../dto/actualizar-entidad.dto'
import { Messages } from 'src/common/constants/response-messages'

@Injectable()
export class EntidadesService extends BaseService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    @Inject(EntidadRepository)
    private entidadRepositorio: EntidadRepository
  ) {
    super()
  }

  async crear(entidadDto: CrearEntidadDto, usuarioAuditoria: string) {
    return await this.entidadRepositorio.crear(entidadDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.entidadRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    entidadDto: ActualizarEntidadDto,
    usuarioAuditoria: string
  ) {
    const entidad = await this.entidadRepositorio.buscarPorId(id)
    if (!entidad) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.entidadRepositorio.actualizar(id, entidadDto, usuarioAuditoria)
    return { id }
  }
}
