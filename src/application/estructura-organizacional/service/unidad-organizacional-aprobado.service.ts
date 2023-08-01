import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable } from '@nestjs/common'
import { CrearUnidadOrganizacionalDto } from '../dto/crear-unidad-organizacional.dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { UnidadOrganizacionalAprobadoRepository } from '../repository/unidad-organizacional-aprobado.repository'

@Injectable()
export class UnidadOrganizacionalAprobadoService extends BaseService {
  constructor(
    @Inject(UnidadOrganizacionalAprobadoRepository)
    private unidadOrganizacionalAprobadoRepositorio: UnidadOrganizacionalAprobadoRepository
  ) {
    super()
  }

  async crear(
    unidadOrganizacionalDto: CrearUnidadOrganizacionalDto,
    usuarioAuditoria: string
  ) {
    return await this.unidadOrganizacionalAprobadoRepositorio.crear(
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.unidadOrganizacionalAprobadoRepositorio.listar(
      paginacionQueryDto
    )
  }

  async listarDependientes(idUnidadOrganizacionalAprobado: string) {
    return await this.unidadOrganizacionalAprobadoRepositorio.listarDependientes(
      idUnidadOrganizacionalAprobado
    )
  }

  async arbolDeUnidadesOrganizacionales() {
    return await this.unidadOrganizacionalAprobadoRepositorio.arbolDeUnidadesOrganizacionalesAprobados()
  }
}
