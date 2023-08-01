import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Permiso } from '../entities/permiso.entity'
import { Status } from 'src/common/constants'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearPermisoDto } from '../dto/crear-permiso.dto'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

@Injectable()
export class PermisoRepository {
  constructor(private dataSource: DataSource) {}

  async listar() {
    return await this.dataSource
      .getRepository(Permiso)
      .createQueryBuilder('permiso')
      .leftJoin('permiso.justificacion', 'justificacion')
      .leftJoin('permiso.tipoPermiso', 'tipo_permiso')
      .select([
        'permiso.id',
        'permiso.motivo',
        'permiso.lugar',
        'permiso.fechaInicio',
        'permiso.horaInicio',
        'permiso.fechaFin',
        'permiso.horaFin',
        'permiso.estado',
        'permiso.idUsuarioVia',
        'permiso.idUsuarioReceptor',
        'permiso.idUsuarioSolicitante',
        'justificacion.id',
        'justificacion.nombre',
        'justificacion.descripcion',
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
      .getRepository(Permiso)
      .createQueryBuilder('permiso')
      .leftJoin('permiso.justificacion', 'justificacion')
      .leftJoin('permiso.tipoPermiso', 'tipo_permiso')
      .select([
        'permiso.id',
        'permiso.motivo',
        'permiso.lugar',
        'permiso.fechaInicio',
        'permiso.horaInicio',
        'permiso.fechaFin',
        'permiso.horaFin',
        'permiso.estado',
        'permiso.idUsuarioVia',
        'permiso.idUsuarioReceptor',
        'permiso.idUsuarioSolicitante',
        'justificacion.id',
        'justificacion.nombre',
        'justificacion.descripcion',
        'tipo_permiso.id',
        'tipo_permiso.sigla',
        'tipo_permiso.nombre',
        'tipo_permiso.descripcion',
      ])
      .orderBy('permiso.id', 'DESC')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(permiso.motivo ilike :filtro or permiso.lugar ilike :filtro or tipo_permiso.nombre ilike :filtro or justificacion.nombre ilike :filtro)',
        {
          filtro: `%${filtro}%`,
        }
      )
    }
    query.andWhere('permiso.estado in (:...estados)', {
      estados: [Status.ACTIVE, Status.CREATE],
    })
    return await query.getManyAndCount()
  }

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Permiso)
      .createQueryBuilder('permiso')
      .where({ id: id })
      .getOne()
  }

  async crear(permisoDto: CrearPermisoDto, usuarioAuditoria: string) {
    const {
      motivo,
      lugar,
      fechaInicio,
      horaInicio,
      fechaFin,
      horaFin,
      idUsuarioVia,
      idUsuarioReceptor,
      idJustificacion,
      idTipoPermiso,
    } = permisoDto

    const horaInicioSinZonaHoraria = dayjs
      .utc(horaInicio)
      .local()
      .format('HH:mm')
    const horaFinSinZonaHoraria = dayjs.utc(horaFin).local().format('HH:mm')

    const nuevoPermiso = new Permiso()
    nuevoPermiso.motivo = motivo
    nuevoPermiso.lugar = lugar
    nuevoPermiso.fechaInicio = fechaInicio
    nuevoPermiso.horaInicio = horaInicioSinZonaHoraria
    nuevoPermiso.fechaFin = fechaFin
    nuevoPermiso.horaFin = horaFinSinZonaHoraria
    nuevoPermiso.idUsuarioVia = idUsuarioVia
    nuevoPermiso.idUsuarioSolicitante = usuarioAuditoria
    nuevoPermiso.idUsuarioReceptor = idUsuarioReceptor
    nuevoPermiso.usuarioCreacion = usuarioAuditoria
    nuevoPermiso.idJustificacion = idJustificacion
    nuevoPermiso.idTipoPermiso = idTipoPermiso

    return await this.dataSource.getRepository(Permiso).save(nuevoPermiso)
  }

  async actualizar(
    id: string,
    permisoDto: CrearPermisoDto,
    usuarioAuditoria: string
  ) {
    const { horaInicio, horaFin, ...restoDatos } = permisoDto
    const horaInicioSinZonaHoraria = dayjs
      .utc(horaInicio)
      .local()
      .format('HH:mm')
    const horaFinSinZonaHoraria = dayjs.utc(horaFin).local().format('HH:mm')
    const datosActualizar: QueryDeepPartialEntity<Permiso> = new Permiso({
      ...restoDatos,
      horaInicio: horaInicioSinZonaHoraria,
      horaFin: horaFinSinZonaHoraria,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Permiso)
      .update(id, datosActualizar)
  }
}
