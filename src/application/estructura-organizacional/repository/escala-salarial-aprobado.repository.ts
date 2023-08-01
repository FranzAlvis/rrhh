import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CrearEscalaSalarialDto } from '../dto/crear-escala-salarial.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { EscalaSalarialAprobado } from '../entity/escala-salarial-aprobado.entity'

@Injectable()
export class EscalaSalarialAprobadoRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number) {
    return await this.dataSource
      .getRepository(EscalaSalarialAprobado)
      .createQueryBuilder('escala-salarial-aprobado')
      .where({ id: id })
      .getOne()
  }

  async crear(
    escalaSalarialDto: CrearEscalaSalarialDto,
    usuarioAuditoria: string
  ) {
    const { nivel_salarial, denominacion_puesto, sueldo_haber_mensual } =
      escalaSalarialDto
    const escalaSalarialAprobado = new EscalaSalarialAprobado()
    escalaSalarialAprobado.nivel_salarial = nivel_salarial
    escalaSalarialAprobado.denominacion_puesto = denominacion_puesto
    escalaSalarialAprobado.sueldo_haber_mensual = sueldo_haber_mensual
    escalaSalarialAprobado.usuarioCreacion = usuarioAuditoria

    return await this.dataSource
      .getRepository(EscalaSalarialAprobado)
      .save(escalaSalarialAprobado)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(EscalaSalarialAprobado)
      .createQueryBuilder('escala-salarial-aprobado')
      .select([
        'escala-salarial-aprobado.id',
        'escala-salarial-aprobado.nivel_salarial',
        'escala-salarial-aprobado.denominacion_puesto',
        'escala-salarial-aprobado.sueldo_haber_mensual',
      ])
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(escala-salarial-aprobado.nivel_salarial ilike :filtro or escala-salarial-aprobado.denominacion_puesto ilike :filtro or escala-salarial-aprobado.sueldo_haber_mensual)',
        { filtro: `%${filtro}` }
      )
    }
    return await query.getManyAndCount()
  }
}
