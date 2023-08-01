import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CrearFeriadoDto } from '../dto/crear-feriados.dto'
import { Feriados } from '../entity/feriados.entity'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { ActualizarFeriadoDto } from '../dto/actualizar-feriados.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
@Injectable()
export class FeriadosRepository {
  constructor(private dataSource: DataSource) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Feriados)
      .createQueryBuilder('feriados')
      .select(['feriados.id', 'feriados.nombre', 'feriados.fecha'])
      .orderBy('feriados.fecha')
      .take(limite)
      .skip(saltar)

    return await query.getManyAndCount()
  }

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Feriados)
      .createQueryBuilder('feriados')
      .where({ id: id })
      .getOne()
  }

  async buscarNombre(nombre: string) {
    return await this.dataSource
      .getRepository(Feriados)
      .createQueryBuilder('feriados')
      .select(['feriados'])
      .where('unaccent(feriados.nombre) ilike unaccent(:nombre)', {
        nombre: `%${nombre}%`,
      })
      .getOne()
  }

  async crear(feriadoDto: CrearFeriadoDto, usuarioAuditoria: string) {
    const { nombre, fecha } = feriadoDto
    const feriado = new Feriados()
    feriado.nombre = nombre
    feriado.fecha = fecha
    feriado.usuarioCreacion = usuarioAuditoria
    return await this.dataSource.getRepository(Feriados).save(feriado)
  }

  async actualizar(
    id: string,
    feriadoDto: ActualizarFeriadoDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar: QueryDeepPartialEntity<Feriados> = new Feriados({
      nombre: feriadoDto.nombre,
      fecha: feriadoDto.fecha,
      usuarioModificacion: usuarioAuditoria,
    })

    return await this.dataSource
      .getRepository(Feriados)
      .update(id, datosActualizar)
  }

  async eliminar(id: string) {
    return await this.dataSource.getRepository(Feriados).delete(id)
  }
}
