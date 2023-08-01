import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Justificacion } from '../entities/justificacion.entity'
import { Status } from 'src/common/constants'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearJustificacionDto } from '../dto/crear-justificacion.dto'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class JustificacionRepository {
  constructor(private dataSource: DataSource) {}
  async listar() {
    return await this.dataSource
      .getRepository(Justificacion)
      .createQueryBuilder('justificacion')
      .select([
        'justificacion.id',
        'justificacion.nombre',
        'justificacion.descripcion',
        'justificacion.idTipoPermiso',
      ])
      .where({ estado: Status.ACTIVE })
      .getMany()
  }

  async listarTodos(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = await this.dataSource
      .getRepository(Justificacion)
      .createQueryBuilder('justificacion')
      .select([
        'justificacion.id',
        'justificacion.nombre',
        'justificacion.descripcion',
        'tipo_permiso.nombre',
        'justificacion.estado',
      ])
      .leftJoin('justificacion.tipoPermiso', 'tipo_permiso')
      .orderBy('justificacion.nombre', 'ASC')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(justificacion.nombre ilike :filtro or justificacion.descripcion ilike :filtro)',
        {
          filtro: `%${filtro}%`,
        }
      )
    }
    query.andWhere('justificacion.estado in (:...estados)', {
      estados: [Status.ACTIVE, Status.CREATE],
    })
    return await query.getManyAndCount()
  }

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Justificacion)
      .createQueryBuilder('justificacion')
      .where({ id: id })
      .getOne()
  }

  async crear(
    justificacionDto: CrearJustificacionDto,
    usuarioAuditoria: string
  ) {
    const { nombre, descripcion, idTipoPermiso } = justificacionDto
    const nuevoTipoPermiso = new Justificacion()
    nuevoTipoPermiso.nombre = nombre
    nuevoTipoPermiso.descripcion = descripcion
    nuevoTipoPermiso.idTipoPermiso = idTipoPermiso
    nuevoTipoPermiso.estado = Status.ACTIVE
    nuevoTipoPermiso.usuarioCreacion = usuarioAuditoria

    return await this.dataSource
      .getRepository(Justificacion)
      .save(nuevoTipoPermiso)
  }

  async actualizar(
    id: string,
    justificacionDto: CrearJustificacionDto,
    usuarioAuditoria: string
  ) {
    const { ...restoDatos } = justificacionDto
    const datosActualizar: QueryDeepPartialEntity<Justificacion> =
      new Justificacion({
        ...restoDatos,
        usuarioModificacion: usuarioAuditoria,
      })
    return await this.dataSource
      .getRepository(Justificacion)
      .update(id, datosActualizar)
  }

  async buscarPorNombre(nombre: string) {
    const nombreMayusculas = nombre.toUpperCase()
    return await this.dataSource
      .getRepository(Justificacion)
      .createQueryBuilder('justificacion')
      .where('UPPER(justificacion.nombre) = :nombre', {
        nombre: nombreMayusculas,
      })
      .getOne()
  }
}
