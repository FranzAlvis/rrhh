import { DataSource } from 'typeorm'
import { CrearOrganigramaDto } from '../dto/crear-organigrama.dto'
import { Organigrama } from '../entity/organigrama.entity'
import { Injectable } from '@nestjs/common'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ActualizarOrganigramaDto } from '../dto/actualizar-organigrama.dto'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class OrganigramaRepository {
  constructor(private dataSource: DataSource) {}

  async crear(organigramaDto: CrearOrganigramaDto, usuarioAuditoria: string) {
    const { version, gestion } = organigramaDto
    const organigrama = new Organigrama()
    organigrama.version = version
    organigrama.gestion = gestion

    organigrama.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Organigrama).save(organigrama)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Organigrama)
      .createQueryBuilder('organigrama')
      .select([
        'organigrama.id',
        'organigrama.version',
        'organigrama.gestion',
        'organigrama.estado',
      ])
      .orderBy('organigrama.gestion', 'DESC')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(organigrama.version ilike :filtro or organigrama.gestion::text ilike :filtro or organigrama.estado ilike :filtro)',
        { filtro: `%${filtro}` }
      )
    }
    return await query.getManyAndCount()
  }

  async actualizar(
    id: string,
    organigramaDto: ActualizarOrganigramaDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar: QueryDeepPartialEntity<Organigrama> =
      new Organigrama({
        ...organigramaDto,
        usuarioModificacion: usuarioAuditoria,
      })
    return await this.dataSource
      .getRepository(Organigrama)
      .update(id, datosActualizar)
  }

  async buscarPorId(id: number) {
    return await this.dataSource
      .getRepository(Organigrama)
      .createQueryBuilder('organigrama')
      .where({ id })
      .getOne()
  }

  async ultimoOrganigrama() {
    return await this.dataSource
      .getRepository(Organigrama)
      .createQueryBuilder('organigrama')
      .orderBy('organigrama.id', 'DESC')
      .getOne()
  }

  async eliminar(id: string) {
    return await this.dataSource.getRepository(Organigrama).delete(id)
  }

  async buscarGestion(gestion: number) {
    return await this.dataSource
      .getRepository(Organigrama)
      .createQueryBuilder('organigrama')
      .select(['organigrama'])
      .where('organigrama.gestion = :gestion', {
        gestion: gestion,
      })
      .getOne()
  }
}
