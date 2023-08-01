import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'
import { OrganigramaRepository } from '../repository/organigrama.repository'
import { CrearAsignacionDePuestosDto } from '../dto/crear-asignacion-de-puestos.dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Organigrama } from '../entity/organigrama.entity'
import { UnidadOrganizacionalMessages } from 'src/common/constants/unidad.organizacional.messages'
import { UnidadOrganizacionalAprobadoRepository } from '../repository/unidad-organizacional-aprobado.repository'
import { EscalaSalarialAprobadoRepository } from '../repository/escala-salarial-aprobado.repository'
import { UnidadOrganizacionalAprobado } from '../entity/unidad-organizacional-aprobado.entity'
import { EscalaSalarialAprobado } from '../entity/escala-salarial-aprobado.entity'
import { AsignacionPuestosAprobadoRepository } from '../repository/asignacion-puestos-aprobado.repository'

@Injectable()
export class AsignacionPuestosAprobadoService extends BaseService {
  constructor(
    @Inject(AsignacionPuestosAprobadoRepository)
    private asignacionPuestosAprobadoRepositorio: AsignacionPuestosAprobadoRepository,
    private unidadOrganizacionalAprobadoRepository: UnidadOrganizacionalAprobadoRepository,
    private organigramaRepository: OrganigramaRepository,
    private escalaSalarialAprobadoRepository: EscalaSalarialAprobadoRepository
  ) {
    super()
  }

  private async getUnidadOrganizacional(
    id: number
  ): Promise<UnidadOrganizacionalAprobado | null> {
    const unidadOrganizacionalAprobado =
      await this.unidadOrganizacionalAprobadoRepository.buscarPorId(id)

    if (unidadOrganizacionalAprobado) return unidadOrganizacionalAprobado

    throw new PreconditionFailedException(
      UnidadOrganizacionalMessages.ORGANIZACIONTAL_UNIT_NOT_FOUND
    )
  }

  private async getOrganigramaPorId(id: number): Promise<Organigrama | null> {
    const organigrama = await this.organigramaRepository.buscarPorId(id)
    if (organigrama) return organigrama

    throw new PreconditionFailedException(
      UnidadOrganizacionalMessages.ORGANIGRAMA_NOT_FOUND
    )
  }

  private async getEscalaSalarialPorId(
    id: number
  ): Promise<EscalaSalarialAprobado | null> {
    const escalaSalarialAprobado =
      await this.escalaSalarialAprobadoRepository.buscarPorId(id)
    if (escalaSalarialAprobado) return escalaSalarialAprobado

    throw new PreconditionFailedException(
      UnidadOrganizacionalMessages.ESCALA_SALARIAL_NOT_FOUND
    )
  }

  async crear(
    asignacionDePuestosDto: CrearAsignacionDePuestosDto,
    usuarioAuditoria: string
  ) {
    const { idUnidadOrganizacional, idEscalaSalarial, idOrganigrama } =
      asignacionDePuestosDto

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

    return await this.asignacionPuestosAprobadoRepositorio.crear(
      asignacionDePuestosDto,
      usuarioAuditoria
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.asignacionPuestosAprobadoRepositorio.listar(
      paginacionQueryDto
    )
  }
}
