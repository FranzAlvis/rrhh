import { BadRequestException, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CrearEntidadDto } from '../dto/crear-entidad.dto'
import { Entidad } from '../entity/entidad.entity'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { ActualizarEntidadDto } from '../dto/actualizar-entidad.dto'

@Injectable()
export class EntidadRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Entidad)
      .createQueryBuilder('entidad')
      .where({ id: id })
      .getOne()
  }

  protected async campoUnico(
    campo: string,
    nombreBuscado: string
  ): Promise<boolean> {
    const count = await this.dataSource
      .getRepository(Entidad)
      .createQueryBuilder('entidad')
      .where(`unaccent(entidad.${campo}) = unaccent(:nombre)`, {
        nombre: nombreBuscado,
      })
      .getCount()

    if (count > 0) return false

    return true
  }

  async crear(entidadDto: CrearEntidadDto, usuarioAuditoria: string) {
    const { nombre, fuente, organismo } = entidadDto

    const nombreValido = await this.campoUnico('nombre', entidadDto.nombre)
    if (!nombreValido) {
      throw new BadRequestException(`El nombre no puede ser repetido.`)
    }

    const entidad = new Entidad()
    entidad.nombre = nombre
    entidad.fuente = fuente
    entidad.organismo = organismo
    entidad.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Entidad).save(entidad)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Entidad)
      .createQueryBuilder('entidad')
      .select([
        'entidad.id',
        'entidad.nombre',
        'entidad.fuente',
        'entidad.organismo',
      ])
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(unaccent(entidad.nombre) ilike unaccent(:filtro) or unaccent(entidad.fuente) ilike unaccent(:filtro) or unaccent(entidad.organismo) ilike unaccent(:filtro))',
        { filtro: `%${filtro}%` }
      )
    }
    return await query.getManyAndCount()
  }

  async actualizar(
    id: string,
    entidadDto: ActualizarEntidadDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar: QueryDeepPartialEntity<Entidad> = new Entidad({
      ...entidadDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Entidad)
      .update(id, datosActualizar)
  }
}
