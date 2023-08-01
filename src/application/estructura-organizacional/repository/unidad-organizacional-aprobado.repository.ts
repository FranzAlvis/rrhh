import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { DataSource } from 'typeorm'
import { CrearUnidadOrganizacionalDto } from '../dto/crear-unidad-organizacional.dto'
import { Injectable } from '@nestjs/common'
import { UnidadOrganizacionalAprobado } from '../entity/unidad-organizacional-aprobado.entity'

@Injectable()
export class UnidadOrganizacionalAprobadoRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number) {
    return await this.dataSource
      .getRepository(UnidadOrganizacionalAprobado)
      .createQueryBuilder('unidadOrganizacionalAprobado')
      .where({ id: id })
      .getOne()
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { saltar, filtro, orden } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(UnidadOrganizacionalAprobado)
      .createQueryBuilder('unidadOrganizacionalAprobado')
      .leftJoinAndSelect(
        'unidadOrganizacionalAprobado.dependencia',
        'dependencia'
      )
      .select([
        'unidadOrganizacionalAprobado.id',
        'unidadOrganizacionalAprobado.nombre',
        'unidadOrganizacionalAprobado.nivel',
        'unidadOrganizacionalAprobado.sigla',
        'dependencia',
      ])
      .orderBy('unidadOrganizacionalAprobado.id', orden)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(unidadOrganizacionalAprobado.nombre ilike :filtro or unidadOrganizacionalAprobado.dependencia ilike :filtro)',
        { filtro: `%${filtro}%` }
      )
    }

    const unidadesOrganizacionalesAprobados = await query.getMany()
    const total = await query.getCount()
    return [unidadesOrganizacionalesAprobados, total]
  }

  async listarDependientes(idUnidadOrganizacionalAprobado: string) {
    const result = await this.dataSource
      .getRepository(UnidadOrganizacionalAprobado)
      .createQueryBuilder('unidadOrganizacionalAprobado')
      .leftJoinAndSelect(
        'unidadOrganizacionalAprobado.dependencia',
        'dependencia'
      )
      .where(
        `unidadOrganizacionalAprobado.id = ${idUnidadOrganizacionalAprobado}`
      )
      .getOne()

    return result?.dependencia
  }

  async arbolDeUnidadesOrganizacionalesAprobados() {
    const result = await this.dataSource.manager
      .getTreeRepository(UnidadOrganizacionalAprobado)
      .findTrees()

    const selected = result.map((unidadOrganizacionalAprobado) => {
      return this.selectTrees(unidadOrganizacionalAprobado)
    })
    return selected
  }

  protected selectTrees(element) {
    if (element.children && element.children.length > 0) {
      element.children = this.selectTrees(element.children[0])
    }
    if (Array.isArray(element.children)) {
      console.log()
      element.children = null
    }
    return {
      id: element.id,
      nombre: element.nombre,
      sigla: element.sigla,
      nivel: element.nivel,
      children: element.children,
    }
  }

  async crear(
    unidadOrganizacionalDto: CrearUnidadOrganizacionalDto,
    usuarioAuditoria: string
  ) {
    const { nivel, nombre, sigla, dependencia } = unidadOrganizacionalDto

    const unidadOrganizacionalAprobado = new UnidadOrganizacionalAprobado()
    unidadOrganizacionalAprobado.nivel = nivel
    unidadOrganizacionalAprobado.nombre = nombre
    unidadOrganizacionalAprobado.dependencia = dependencia
      ? (dependencia as UnidadOrganizacionalAprobado)
      : null
    unidadOrganizacionalAprobado.sigla = sigla
    unidadOrganizacionalAprobado.usuarioCreacion = usuarioAuditoria

    return await this.dataSource
      .getRepository(UnidadOrganizacionalAprobado)
      .save(unidadOrganizacionalAprobado)
  }
}
