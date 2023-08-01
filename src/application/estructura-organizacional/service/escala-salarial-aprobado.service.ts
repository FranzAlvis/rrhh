import { Inject, Injectable } from '@nestjs/common'
import { AuthZManagementService } from 'nest-authz'
import { BaseService } from 'src/common/base/base-service'
import { CrearEscalaSalarialDto } from '../dto/crear-escala-salarial.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { EscalaSalarialAprobadoRepository } from '../repository/escala-salarial-aprobado.repository'

@Injectable()
export class EscalaSalarialAprobadoService extends BaseService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    @Inject(EscalaSalarialAprobadoRepository)
    private escalaSalarialAprobadoRepository: EscalaSalarialAprobadoRepository
  ) {
    super()
  }

  async crear(
    escalaSalarialDto: CrearEscalaSalarialDto,
    usuarioAuditoria: string
  ) {
    return await this.escalaSalarialAprobadoRepository.crear(
      escalaSalarialDto,
      usuarioAuditoria
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.escalaSalarialAprobadoRepository.listar(
      paginacionQueryDto
    )
  }
}
