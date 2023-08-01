import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { TipoPermiso } from '../entities/tipo_permiso.entity'
import { Status } from 'src/common/constants'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearTipoPermisoDto } from '../dto/crear-tipo_permiso.dto'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class TipoPermisoRepository {
  constructor(private dataSource: DataSource) {}
  async listar() {
    return await this.dataSource
      .getRepository(TipoPermiso)
      .createQueryBuilder('tipo_permiso')
      .select([
        'tipo_permiso.id',
        'tipo_permiso.sigla',
        'tipo_permiso.nombre',
        'tipo_permiso.descripcion',
      ])
      .where({ estado: Status.ACTIVE })
      .getMany()
  }

  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = await this.dataSource
      .getRepository(TipoPermiso)
      .createQueryBuilder('tipo_permiso')
      .select([
        'tipo_permiso.id',
        'tipo_permiso.sigla',
        'tipo_permiso.nombre',
        'tipo_permiso.descripcion',
        'tipo_permiso.estado',
      ])
      .orderBy('tipo_permiso.nombre', 'ASC')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(tipo_permiso.sigla ilike :filtro or tipo_permiso.nombre ilike :filtro or tipo_permiso.descripcion ilike :filtro)',
        {
          filtro: `%${filtro}%`,
        }
      )
    }
    query.andWhere('tipo_permiso.estado in (:...estados)', {
      estados: [Status.ACTIVE, Status.CREATE],
    })
    return await query.getManyAndCount()
  }

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(TipoPermiso)
      .createQueryBuilder('tipo_permiso')
      .where({ id: id })
      .getOne()
  }

  async crear(tipoPermisoDto: CrearTipoPermisoDto, usuarioAuditoria: string) {
    const { sigla, nombre, descripcion } = tipoPermisoDto
    const nuevoTipoPermiso = new TipoPermiso()
    nuevoTipoPermiso.sigla = sigla
    nuevoTipoPermiso.nombre = nombre
    nuevoTipoPermiso.descripcion = descripcion
    nuevoTipoPermiso.estado = Status.ACTIVE
    nuevoTipoPermiso.usuarioCreacion = usuarioAuditoria

    return await this.dataSource
      .getRepository(TipoPermiso)
      .save(nuevoTipoPermiso)
  }

  async obtenerJustificacionPorTipo(idTipo: string) {
    return await this.dataSource
      .getRepository(TipoPermiso)
      .createQueryBuilder('tipoPermiso')
      .leftJoinAndSelect('tipoPermiso.justificaciones', 'justificaciones')
      .select([
        'tipoPermiso.id',
        'tipoPermiso.sigla',
        'tipoPermiso.nombre',
        'tipoPermiso.descripcion',
        'justificaciones.id',
        'justificaciones.nombre',
        'justificaciones.descripcion',
      ])
      .where('tipoPermiso.id = :idTipo', { idTipo })
      .getOne()
  }

  async actualizar(
    id: string,
    tipoPermisoDto: CrearTipoPermisoDto,
    usuarioAuditoria: string
  ) {
    const { ...restoDatos } = tipoPermisoDto
    const datosActualizar: QueryDeepPartialEntity<TipoPermiso> =
      new TipoPermiso({
        ...restoDatos,
        usuarioModificacion: usuarioAuditoria,
      })
    return await this.dataSource
      .getRepository(TipoPermiso)
      .update(id, datosActualizar)
  }

  async buscarPorNombre(nombre: string) {
    const nombreMayusculas = nombre.toUpperCase()
    return await this.dataSource
      .getRepository(TipoPermiso)
      .createQueryBuilder('tipo_permiso')
      .where('UPPER(tipo_permiso.nombre) = :nombre', {
        nombre: nombreMayusculas,
      })
      .getOne()
  }

  async buscarPorSigla(sigla: string) {
    const siglaMayusculas = sigla.toUpperCase()
    return await this.dataSource
      .getRepository(TipoPermiso)
      .createQueryBuilder('tipo_permiso')
      .where('UPPER(tipo_permiso.sigla) = :sigla', { sigla: siglaMayusculas })
      .getOne()
  }
}
