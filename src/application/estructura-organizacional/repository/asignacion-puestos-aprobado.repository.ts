import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { DataSource } from 'typeorm'
import { CrearAsignacionDePuestosDto } from '../dto/crear-asignacion-de-puestos.dto'
import { Injectable } from '@nestjs/common'
import { AsignacionPuestosAprobado } from '../entity/asignacion-puestos-aprobado.entity'

@Injectable()
export class AsignacionPuestosAprobadoRepository {
  constructor(private dataSource: DataSource) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { saltar, filtro, orden, limite } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(AsignacionPuestosAprobado)
      .createQueryBuilder('asignacionPuestosAprobado')
      .leftJoinAndSelect(
        'asignacionPuestosAprobado.unidadOrganizacionalAprobado',
        'unidadOrganizacionalAprobado'
      )
      .leftJoinAndSelect('asignacionPuestosAprobado.organigrama', 'organigrama')
      .leftJoinAndSelect(
        'asignacionPuestosAprobado.escalaSalarialAprobado',
        'escalaSalarialAprobado'
      )
      .select([
        'asignacionPuestosAprobado.id',
        'asignacionPuestosAprobado.descripcion_puesto',
        'asignacionPuestosAprobado.nro_item',
        'asignacionPuestosAprobado.nivel',
        'asignacionPuestosAprobado.cargo',
        'unidadOrganizacionalAprobado',
        'organigrama',
        'escalaSalarialAprobado',
      ])
      .orderBy('asignacionPuestosAprobado.id', orden)
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(asignacionPuestosAprobado.nombre ilike :filtro or asignacionPuestosAprobado.dependencia ilike :filtro)',
        { filtro: `%${filtro}%` }
      )
    }

    const asignacionesPuestosAprobado = await query.getMany()
    const total = await query.getCount()
    return [asignacionesPuestosAprobado, total]
  }

  async crear(
    asignacionDePuestosDto: CrearAsignacionDePuestosDto,
    usuarioAuditoria: string
  ) {
    const {
      nivel,
      descripcion_puesto,
      nro_item,
      idUnidadOrganizacional,
      idEscalaSalarial,
      cargo,
      idOrganigrama,
    } = asignacionDePuestosDto

    const asignacionPuestosAprobado = new AsignacionPuestosAprobado()
    asignacionPuestosAprobado.descripcion_puesto = descripcion_puesto
    asignacionPuestosAprobado.nro_item = nro_item
    asignacionPuestosAprobado.nivel = nivel
    asignacionPuestosAprobado.cargo = cargo
    asignacionPuestosAprobado.idUnidadOrganizacional = idUnidadOrganizacional
      ? idUnidadOrganizacional
      : null
    asignacionPuestosAprobado.idEscalaSalarial = idEscalaSalarial
      ? idEscalaSalarial
      : null
    asignacionPuestosAprobado.idOrganigrama = idOrganigrama
      ? idOrganigrama
      : null
    asignacionPuestosAprobado.usuarioCreacion = usuarioAuditoria

    return await this.dataSource
      .getRepository(AsignacionPuestosAprobado)
      .save(asignacionPuestosAprobado)
  }
}
