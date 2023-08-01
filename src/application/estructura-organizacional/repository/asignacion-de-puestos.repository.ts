import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { DataSource } from 'typeorm'
import { CrearAsignacionDePuestosDto } from '../dto/crear-asignacion-de-puestos.dto'
import { AsignacionDePuestos } from '../entity/asignacion-de-puestos.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ActualizarAsignacionDePuestosDto } from '../dto/actualizar-asignacion-de-puestos.dto'
import { DateService } from '../../../common/lib/date.service'

@Injectable()
export class AsignacionDePuestosRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string): Promise<AsignacionDePuestos | null> {
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionDePuestos')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    asignacionDePuestosDto: ActualizarAsignacionDePuestosDto,
    usuarioModificacion: string
  ) {
    const { idUnidadOrganizacional, idEscalaSalarial, idOrganigrama } =
      asignacionDePuestosDto
    const datosActualizar: QueryDeepPartialEntity<AsignacionDePuestos> =
      new AsignacionDePuestos({
        ...asignacionDePuestosDto,
        idUnidadOrganizacional,
        idEscalaSalarial,
        idOrganigrama,
        usuarioModificacion,
      })
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto, idOrganigrama) {
    const { saltar, filtro, orden, limite } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionDePuestos')
      .leftJoinAndSelect(
        'asignacionDePuestos.unidadOrganizacional',
        'unidadOrganizacional'
      )
      .leftJoinAndSelect('asignacionDePuestos.organigrama', 'organigrama')
      .leftJoinAndSelect('asignacionDePuestos.escalaSalarial', 'escalaSalarial')
      .select([
        'asignacionDePuestos.id',
        'asignacionDePuestos.descripcion_puesto',
        'asignacionDePuestos.nro_item',
        'asignacionDePuestos.nivel',
        'asignacionDePuestos.cargo',
        'unidadOrganizacional.id',
        'unidadOrganizacional.nombre',
        'unidadOrganizacional.nivel',
        'unidadOrganizacional.sigla',
        'unidadOrganizacional.idDependencia',
        'organigrama.id',
        'organigrama.version',
        'organigrama.gestion',
        'escalaSalarial.id',
        'escalaSalarial.nivel_salarial',
        'escalaSalarial.denominacion_puesto',
        'escalaSalarial.sueldo_haber_mensual',
        'escalaSalarial.tipo',
      ])
      .orderBy('asignacionDePuestos.id', orden)
      .take(limite)
      .skip(saltar)
      .take(limite)

    if (filtro) {
      query.andWhere(
        '(asignacionDePuestos.descripcion_puesto ilike :filtro or escalaSalarial.denominacion_puesto ilike :filtro)',
        { filtro: `%${filtro}%` }
      )
    }
    query.andWhere('asignacionDePuestos.organigrama.id = :id', {
      id: idOrganigrama,
    })

    const asignacionesDePuestos = await query.getMany()
    const total = await query.getCount()
    return [asignacionesDePuestos, total]
  }

  async listarTodo(paginacionQueryDto: PaginacionQueryDto, idOrganigrama) {
    const { filtro, orden } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionDePuestos')
      .leftJoinAndSelect(
        'asignacionDePuestos.unidadOrganizacional',
        'unidadOrganizacional'
      )
      .leftJoinAndSelect('asignacionDePuestos.organigrama', 'organigrama')
      .leftJoinAndSelect('asignacionDePuestos.escalaSalarial', 'escalaSalarial')
      .select([
        'asignacionDePuestos.id',
        'asignacionDePuestos.descripcion_puesto',
        'asignacionDePuestos.nro_item',
        'asignacionDePuestos.nivel',
        'asignacionDePuestos.cargo',
        'unidadOrganizacional.id',
        'unidadOrganizacional.nombre',
        'unidadOrganizacional.nivel',
        'unidadOrganizacional.sigla',
        'unidadOrganizacional.idDependencia',
        'organigrama.id',
        'organigrama.version',
        'organigrama.gestion',
        'escalaSalarial.id',
        'escalaSalarial.nivel_salarial',
        'escalaSalarial.denominacion_puesto',
        'escalaSalarial.sueldo_haber_mensual',
        'escalaSalarial.tipo',
      ])
      .orderBy('asignacionDePuestos.id', orden)

    if (filtro) {
      query.andWhere(
        '(asignacionDePuestos.nombre ilike :filtro or asignacionDePuestos.dependencia ilike :filtro)',
        { filtro: `%${filtro}%` }
      )
    }
    query.andWhere('asignacionDePuestos.organigrama.id = :id', {
      id: idOrganigrama,
    })

    const asignacionesDePuestos = await query.getMany()
    const total = await query.getCount()
    return [asignacionesDePuestos, total]
  }

  async listarUltimoItem() {
    const query = this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionDePuestos')
      .select(['asignacionDePuestos.nro_item'])
      .orderBy('asignacionDePuestos.id', 'DESC')
      .take(1)

    const ultimoItem = await query.getOne()
    return ultimoItem ? ultimoItem.nro_item : 0
  }

  protected async camposUnicos(
    campos: string[],
    asignacionDePuestos:
      | CrearAsignacionDePuestosDto
      | ActualizarAsignacionDePuestosDto
  ): Promise<string[]> {
    const repetidos: any = await campos.map(async (campo) => {
      const count = await this.dataSource
        .getRepository(AsignacionDePuestos)
        .createQueryBuilder('asignacionDePuesto')
        .where(
          `LOWER(TRANSLATE(asignacionDePuestos.${campo}, 'áéíóúÁÉÍÓÚ', 'aeiouAEIOU')) = LOWER(TRANSLATE(:nombre, 'áéíóúÁÉÍÓÚ', 'aeiouAEIOU'))`,
          {
            descripcion_puesto: asignacionDePuestos[campo],
          }
        )
        .getCount()
      if (count > 0) return campo
      return ''
    })

    const existe: string[] = repetidos.filter((e: string) => e)

    if (existe.length > 0) {
      let message = `El campo ${existe[0]} no puede ser repetido`
      if (existe.length > 1) {
        message = `Los campos ${existe.map(
          (campo) => campo + ', '
        )} no pueden ser repetidos`
      }
      throw new BadRequestException(message)
    }

    return existe
  }

  async crear(
    asignacionDePuestosDto: CrearAsignacionDePuestosDto,
    usuarioAuditoria: string
  ) {
    const {
      nivel,
      descripcion_puesto,
      idUnidadOrganizacional,
      idEscalaSalarial,
      cargo,
      idOrganigrama,
    } = asignacionDePuestosDto

    const numeroItemGenerado = (await this.listarUltimoItem()) + 1

    const asignacionDePuestos = new AsignacionDePuestos()
    asignacionDePuestos.descripcion_puesto = descripcion_puesto
    asignacionDePuestos.nro_item = numeroItemGenerado
    asignacionDePuestos.nivel = nivel
    asignacionDePuestos.cargo = cargo
    asignacionDePuestos.idUnidadOrganizacional = idUnidadOrganizacional
    asignacionDePuestos.idEscalaSalarial = idEscalaSalarial
    asignacionDePuestos.idOrganigrama = idOrganigrama
    asignacionDePuestos.usuarioCreacion = usuarioAuditoria

    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .save(asignacionDePuestos)
  }

  async eliminar(IdAsignacionDePuestos: string) {
    this.dataSource
      .getRepository(AsignacionDePuestos)
      .delete(IdAsignacionDePuestos)
  }

  async obtenerUnidadesOrganizacionales(idOrganigrama: number) {
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionPuesto')
      .select([
        'asignacionPuesto.idUnidadOrganizacional as idUnidadOrganizacional',
      ])
      .where('asignacionPuesto.organigrama.id = :id', { id: idOrganigrama })
      .groupBy('asignacionPuesto.idUnidadOrganizacional')
      .orderBy('asignacionPuesto.idUnidadOrganizacional', 'ASC')
      .getRawMany()
  }

  async obtenerEscalasSalariales(idOrganigrama: number) {
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('escalaSalarial')
      .select(['escalaSalarial.idEscalaSalarial as idEscalaSalarial'])
      .where('escalaSalarial.organigrama.id = :id', { id: idOrganigrama })
      .groupBy('escalaSalarial.idEscalaSalarial')
      .orderBy('escalaSalarial.idEscalaSalarial', 'ASC')
      .getRawMany()
  }

  async obtenerAsignacionesPuestos(idOrganigrama: number) {
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionPuesto')
      .select(['asignacionPuesto.id as asignacionPuesto_id'])
      .where('asignacionPuesto.organigrama.id = :id', { id: idOrganigrama })
      .groupBy('asignacionPuesto_id')
      .orderBy('asignacionPuesto_id', 'ASC')
      .getRawMany()
  }

  async obtenerCargos(cargo: number) {
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacion_puesto')
      .where('asignacion_puesto.cargo = :cargo', { cargo: cargo })
      .getOne()
  }

  async obtenerNroItems(nroItem: number) {
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacion_puesto')
      .where('asignacion_puesto.nro_item = :nro_item', { nro_item: nroItem })
      .getOne()
  }

  async obtenerUnidadesOrganizacional(idUnidadOrganizacional: number) {
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacion_puesto')
      .where(
        'asignacion_puesto.id_unidades_organizacionales = :id_unidades_organizacionales',
        { id_unidades_organizacionales: idUnidadOrganizacional }
      )
      .getOne()
  }

  async listarAsignacionesPuestoPorGestionActual() {
    const gestionActual = DateService.obtenerGestionActual()
    return await this.dataSource
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionDePuestos')
      .leftJoinAndSelect(
        'asignacionDePuestos.unidadOrganizacional',
        'unidadOrganizacional'
      )
      .leftJoinAndSelect('asignacionDePuestos.organigrama', 'organigrama')
      .leftJoinAndSelect('asignacionDePuestos.escalaSalarial', 'escalaSalarial')
      .select([
        'asignacionDePuestos.id',
        'asignacionDePuestos.descripcion_puesto',
        'asignacionDePuestos.nro_item',
        'asignacionDePuestos.nivel',
        'asignacionDePuestos.cargo',
        'unidadOrganizacional.id',
        'unidadOrganizacional.nombre',
        'unidadOrganizacional.sigla',
        'escalaSalarial.id',
        'escalaSalarial.denominacion_puesto',
        'escalaSalarial.sueldo_haber_mensual',
      ])
      .where(`organigrama.gestion = :gestionActual`, {
        gestionActual: gestionActual,
      })
      .orderBy('asignacionDePuestos.nro_item')
      .getMany()
  }
}
