import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { AuthZManagementService } from 'nest-authz'
import { BaseService } from 'src/common/base/base-service'
import { EscalaSalarialRepository } from '../repository/escala-salarial.repository'
import { CrearEscalaSalarialDto } from '../dto/crear-escala-salarial.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ActualizarEscalaSalarialDto } from '../dto/actualizar-escala-salarial.dto'
import { UnidadOrganizacionalMessages } from 'src/common/constants/unidad.organizacional.messages'
import { EscalaSalarialAprobadoService } from './escala-salarial-aprobado.service'
import { EscalaSalarial } from '../entity/escala-salarial.entity'

@Injectable()
export class EscalaSalarialService extends BaseService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    @Inject(EscalaSalarialRepository)
    private escalaSalarialRepository: EscalaSalarialRepository,
    private readonly escalaSalarialAprobadoService: EscalaSalarialAprobadoService
  ) {
    super()
  }

  async crear(
    escalaSalarialDto: CrearEscalaSalarialDto,
    usuarioAuditoria: string
  ) {
    const { nivel_salarial, denominacion_puesto, sueldo_haber_mensual } =
      escalaSalarialDto
    const existenteNivelSalarial =
      await this.escalaSalarialRepository.buscarNivelSalarial(nivel_salarial)

    if (existenteNivelSalarial) {
      throw new NotFoundException(
        'Ya existe una escala salarial con el mismo nivel salarial'
      )
    }

    const existenteDenominacionPuesto =
      await this.escalaSalarialRepository.buscarDenominacionPuesto(
        denominacion_puesto
      )
    if (existenteDenominacionPuesto) {
      throw new NotFoundException(
        'Ya existe una escala salarial con la misma denominación de puesto'
      )
    }

    const existenteSueldoHaberMensual =
      await this.escalaSalarialRepository.buscarSueldoHaberMensual(
        sueldo_haber_mensual
      )
    if (existenteSueldoHaberMensual) {
      throw new NotFoundException(
        'Ya existe una escala salarial con el mismo sueldo haber mensual'
      )
    }

    return await this.escalaSalarialRepository.crear(
      escalaSalarialDto,
      usuarioAuditoria
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.escalaSalarialRepository.listar(paginacionQueryDto)
  }

  async listarTodo(paginacionQueryDto: PaginacionQueryDto) {
    return await this.escalaSalarialRepository.listarTodo(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    escalaSalarialDto: ActualizarEscalaSalarialDto,
    usuarioAuditoria: string
  ) {
    const { nivel_salarial, denominacion_puesto, sueldo_haber_mensual } =
      escalaSalarialDto

    const item = await this.escalaSalarialRepository.buscarPorId(+id)
    if (!item) {
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ESCALA_SALARIAL_NOT_FOUND
      )
    }

    const existenteNivelSalarial =
      await this.escalaSalarialRepository.buscarNivelSalarial(nivel_salarial)
    if (existenteNivelSalarial && existenteNivelSalarial.id !== id) {
      throw new NotFoundException(
        'Ya existe una escala salarial con el mismo nivel salarial'
      )
    }

    const existenteDenominacionPuesto =
      await this.escalaSalarialRepository.buscarDenominacionPuesto(
        denominacion_puesto
      )
    if (existenteDenominacionPuesto && existenteDenominacionPuesto.id !== id) {
      throw new NotFoundException(
        'Ya existe una escala salarial con la misma denominación de puesto'
      )
    }

    const existenteSueldoHaberMensual =
      await this.escalaSalarialRepository.buscarSueldoHaberMensual(
        sueldo_haber_mensual
      )
    if (existenteSueldoHaberMensual && existenteSueldoHaberMensual.id !== id) {
      throw new NotFoundException(
        'Ya existe una escala salarial con el mismo sueldo haber mensual'
      )
    }

    await this.escalaSalarialRepository.actualizar(
      id,
      escalaSalarialDto,
      usuarioAuditoria
    )
    return { id }
  }

  async eliminarEscalaSalarial(IdEscalaSalarial: string) {
    await this.escalaSalarialRepository.eliminar(IdEscalaSalarial)
    return IdEscalaSalarial
  }

  async aprobarEscalasSalariales(
    idEscalasSalariales,
    usuarioAuditoria: string
  ) {
    console.log('aprobarEscalaSalariales', idEscalasSalariales)
    for (const es of idEscalasSalariales) {
      const escalaSalarial = await this.escalaSalarialRepository.buscarPorId(
        +es.idescalasalarial
      )
      if (escalaSalarial) {
        const escalaSalarialDto: CrearEscalaSalarialDto =
          this.armarEscalaSalarialDto(escalaSalarial)
        await this.escalaSalarialAprobadoService.crear(
          escalaSalarialDto,
          usuarioAuditoria
        )
      }
    }
    console.log('Termina el for')
  }

  armarEscalaSalarialDto(escalaSalarial: EscalaSalarial) {
    const escalaSalarialDto: CrearEscalaSalarialDto = {
      nivel_salarial: escalaSalarial.nivel_salarial,
      denominacion_puesto: escalaSalarial.denominacion_puesto,
      sueldo_haber_mensual: escalaSalarial.sueldo_haber_mensual,
      tipo: escalaSalarial.tipo,
    }
    console.log('armarEscalaSalarial')
    console.log(escalaSalarial)
    return escalaSalarialDto
  }
}
