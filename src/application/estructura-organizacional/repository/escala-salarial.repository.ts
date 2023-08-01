import { BadRequestException, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CrearEscalaSalarialDto } from '../dto/crear-escala-salarial.dto'
import { EscalaSalarial } from '../entity/escala-salarial.entity'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ActualizarEscalaSalarialDto } from '../dto/actualizar-escala-salarial.dto'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class EscalaSalarialRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number) {
    return await this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escalaSalarial')
      .select(['escalaSalarial'])
      .where('escalaSalarial.id=:id', { id: id })
      .getOne()
  }

  async buscarNivelSalarial(nivel_salarial: number) {
    return await this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escalaSalarial')
      .select(['escalaSalarial'])
      .where('escalaSalarial.nivel_salarial = :nivel_salarial', {
        nivel_salarial: nivel_salarial,
      })
      .getOne()
  }
  async buscarDenominacionPuesto(denominacion_puesto: string) {
    const queryBuilder = this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escalaSalarial')
      .select(['escalaSalarial'])
      .where(
        'unaccent(escalaSalarial.denominacion_puesto) ilike unaccent(:denominacion_puesto)',
        {
          denominacion_puesto: `%${denominacion_puesto}`,
        }
      )
    const query = queryBuilder.getQuery()
    console.log('Consulta generada:', query)

    return await queryBuilder.getOne()
  }
  async buscarSueldoHaberMensual(sueldo_haber_mensual: number) {
    return await this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escalaSalarial')
      .select(['escalaSalarial'])
      .where('escalaSalarial.sueldo_haber_mensual = :sueldo_haber_mensual', {
        sueldo_haber_mensual: sueldo_haber_mensual,
      })
      .getOne()
  }

  async crear(
    escalaSalarialDto: CrearEscalaSalarialDto,
    usuarioAuditoria: string
  ) {
    const { nivel_salarial, denominacion_puesto, sueldo_haber_mensual, tipo } =
      escalaSalarialDto
    const escalaSalarial = new EscalaSalarial()
    escalaSalarial.nivel_salarial = nivel_salarial
    escalaSalarial.denominacion_puesto = denominacion_puesto
    escalaSalarial.sueldo_haber_mensual = sueldo_haber_mensual
    escalaSalarial.tipo = tipo
    escalaSalarial.usuarioCreacion = usuarioAuditoria

    return await this.dataSource
      .getRepository(EscalaSalarial)
      .save(escalaSalarial)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escala-salarial')
      .leftJoinAndSelect('escala-salarial.tipo', 'tipo')
      .select([
        'escala-salarial.id',
        'escala-salarial.nivel_salarial',
        'escala-salarial.denominacion_puesto',
        'escala-salarial.sueldo_haber_mensual',
        'tipo.codigo',
        'tipo.nombre',
        'tipo.grupo',
        'tipo.descripcion',
      ])
      .orderBy('escala-salarial.nivel_salarial', 'ASC')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '((escala-salarial.nivel_salarial)::text ilike :filtro or unaccent(escala-salarial.denominacion_puesto) ilike unaccent(:filtro) or (escala-salarial.sueldo_haber_mensual)::text ilike :filtro or escala-salarial.tipo ilike :filtro)',
        {
          filtro: `%${filtro}%`,
        }
      )
    }
    return await query.getManyAndCount()
  }

  async listarTodo(paginacionQueryDto: PaginacionQueryDto) {
    const { saltar, filtro, orden } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escala-salarial')
      .select([
        'escala-salarial.id',
        'escala-salarial.nivel_salarial',
        'escala-salarial.denominacion_puesto',
        'escala-salarial.sueldo_haber_mensual',
        'escala-salarial.tipo',
      ])
      .orderBy('escala-salarial.nivel_salarial', orden)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(escala-salarial.nivel_salarial ilike :filtro or escala-salarial.denominacion_puesto ilike :filtro or escala-salarial.sueldo_haber_mensual)',
        { filtro: `%${filtro}` }
      )
    }
    return await query.getManyAndCount()
  }

  async actualizar(
    id: string,
    escalaSalarialDto: ActualizarEscalaSalarialDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar: QueryDeepPartialEntity<EscalaSalarial> =
      new EscalaSalarial({
        ...escalaSalarialDto,
        usuarioModificacion: usuarioAuditoria,
      })
    return await this.dataSource
      .getRepository(EscalaSalarial)
      .update(id, datosActualizar)
  }

  async eliminar(id: string) {
    const escalaSalarial = await this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escala-salarial')
      .leftJoinAndSelect(
        'escala-salarial.asignacionesDePuestos',
        'asignacionesDePuestos'
      )
      .where('escala-salarial.id = :id', { id: id })
      .getOne()

    const array = escalaSalarial?.asignacionesDePuestos ?? []
    console.log(array)
    if (array.length > 0) {
      throw new BadRequestException(
        'La escala salarial tiene asignaciones de puesto relacionadas. No se puede eliminar.'
      )
    }
    this.dataSource.getRepository(EscalaSalarial).delete(id)
  }
}
