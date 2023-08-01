import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { DataSource } from 'typeorm'
import { CrearUnidadOrganizacionalDto } from '../dto/crear-unidad-organizacional.dto'
import { UnidadOrganizacional } from '../entity/unidad-organizacional.entity'
import { AsignacionDePuestos } from '../entity/asignacion-de-puestos.entity'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ActualizarUnidadOrganizacionalDto } from '../dto/actualizar-unidad-organizacional.dto'
import { UnidadOrganizacionalMessages } from 'src/common/constants/unidad.organizacional.messages'

@Injectable()
export class UnidadOrganizacionalRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number): Promise<UnidadOrganizacional> {
    return await this.dataSource
      .getRepository(UnidadOrganizacional)
      .createQueryBuilder('unidadOrganizacional')
      .leftJoinAndSelect('unidadOrganizacional.dependencia', 'dependencia')
      .select(['unidadOrganizacional', 'dependencia'])
      .where({ id: id })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(
          UnidadOrganizacionalMessages.UNIDAD_ORGANIZACIONAL_NOT_FOUND
        )
      })
  }

  async actualizar(
    id: string,
    unidadOrganizacionalDto: ActualizarUnidadOrganizacionalDto,
    usuarioAuditoria: string
  ) {
    const root = await this.getNodoRaiz()
    if (root.id === id && unidadOrganizacionalDto.dependencia) {
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIZACIONTAL_NOT_ALLOW_HAS_NEW_ROOT
      )
    }

    const result = await this.actualizarUsandoTransacion(
      id,
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
    return result
  }

  protected async actualizarUsandoTransacion(
    id: string,
    unidadOrganizacionalDto: ActualizarUnidadOrganizacionalDto,
    usuarioAuditoria
  ) {
    return await this.dataSource.transaction(async (transactionManager) => {
      try {
        const nodoUO = await this.buscarPorId(+id)
        const descendientes = await transactionManager
          .getTreeRepository(UnidadOrganizacional)
          .findDescendantsTree(nodoUO)

        if (unidadOrganizacionalDto.dependencia) {
          await this.actualizarMPath(
            nodoUO.id,
            unidadOrganizacionalDto.dependencia.id,
            transactionManager
          )
        }
        const dependencia = await this.vincularNuevoParde(
          descendientes,
          unidadOrganizacionalDto.dependencia
        )

        const datosActualizar = UnidadOrganizacional.create({
          nivel: dependencia.nivel + 1,
          nombre: unidadOrganizacionalDto.nombre,
          sigla: unidadOrganizacionalDto.sigla,
          usuarioCreacion: usuarioAuditoria,
          dependencia: dependencia,
        })

        return await this.actualizarHijos(
          descendientes,
          datosActualizar,
          transactionManager
        )
      } catch (error) {
        throw new BadRequestException(
          UnidadOrganizacionalMessages.UNIDAD_ORGANIZACIONAL_UPDATE_FAILED
        )
      }
    })
  }

  protected async actualizarHijos(parent, datosActualizar, transactionManager) {
    const nivel = datosActualizar.nivel + 1
    await transactionManager
      .getTreeRepository(UnidadOrganizacional)
      .update(parent.id, datosActualizar)
    for (let i = 0; i < parent.hijos?.length && parent.hijos?.length > 0; i++) {
      const datosActualizar = UnidadOrganizacional.create({
        nivel: nivel,
        usuarioCreacion: parent.usuarioCreacion,
      })
      await this.actualizarHijos(
        parent.hijos[i],
        datosActualizar,
        transactionManager
      )
    }
  }

  protected async vincularNuevoParde(actualPadre, nuevoPadre) {
    if (!nuevoPadre) return actualPadre.dependencia
    const newParent = await this.buscarPorId(+nuevoPadre.id)
    if (!newParent)
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIZACIONTAL_UNIT_NOT_FOUND
      )
    return newParent
  }

  protected async getMpathNode(padreId, transactionManager) {
    return await transactionManager
      .getRepository(UnidadOrganizacional)
      .createQueryBuilder('unidadOrganizacional')
      .select('mpath')
      .where({ id: padreId })
      .getRawOne()
  }

  protected async actualizarMPath(
    actualPadreId,
    nuevoPadreId,
    transactionManager
  ) {
    const resultMpathActual = await this.getMpathNode(
      actualPadreId,
      transactionManager
    )
    const resultMpathNuevo = await this.getMpathNode(
      nuevoPadreId,
      transactionManager
    )
    const newPath = this.crearNuevoMPath(resultMpathNuevo.mpath, actualPadreId)
    await transactionManager
      .createQueryBuilder()
      .update(UnidadOrganizacional)
      .set({
        mpath: () =>
          `REPLACE(mpath, '${resultMpathActual.mpath}', '${newPath}')`,
      })
      .where(`mpath like '%${actualPadreId}%'`)
      .execute()
  }

  protected crearNuevoMPath(mpathNuevo: string, padreId: string) {
    const nuevoMPath: string[] = []
    const nuevoPadreMpath = mpathNuevo.split('.')
    for (const path of nuevoPadreMpath) {
      if (path) nuevoMPath.push(path)
    }
    nuevoMPath.push(`${padreId}.`)
    return nuevoMPath.join('.')
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(UnidadOrganizacional)
      .createQueryBuilder('unidadOrganizacional')
      .leftJoinAndSelect('unidadOrganizacional.dependencia', 'dependencia')
      .select([
        'unidadOrganizacional.id',
        'unidadOrganizacional.nombre',
        'unidadOrganizacional.nivel',
        'unidadOrganizacional.sigla',
        'dependencia',
      ])
      .orderBy('unidadOrganizacional.id', orden)
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        "(unidadOrganizacional.nombre ilike :filtro or unidadOrganizacional.sigla ilike :filtro or (unidadOrganizacional.nivel)::text ilike :filtro or COALESCE(dependencia.nombre, '') ilike :filtro or (unidadOrganizacional.dependencia)::text ilike :filtro)",
        { filtro: `%${filtro}%` }
      )
    }

    const unidadesOrganizacionales = await query.getMany()
    const total = await query.getCount()
    return [unidadesOrganizacionales, total]
  }

  async listarTodo(paginacionQueryDto: PaginacionQueryDto) {
    const { orden, saltar, filtro } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(UnidadOrganizacional)
      .createQueryBuilder('unidadOrganizacional')
      .leftJoinAndSelect('unidadOrganizacional.dependencia', 'dependencia')
      .select([
        'unidadOrganizacional.id',
        'unidadOrganizacional.nombre',
        'unidadOrganizacional.nivel',
        'unidadOrganizacional.sigla',
        'dependencia',
      ])
      .orderBy('unidadOrganizacional.id', orden)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        "(unidadOrganizacional.nombre ilike :filtro or unidadOrganizacional.sigla ilike :filtro or (unidadOrganizacional.nivel)::text ilike :filtro or COALESCE(dependencia.nombre, '') ilike :filtro or (unidadOrganizacional.dependencia)::text ilike :filtro)",
        { filtro: `%${filtro}%` }
      )
    }

    const unidadesOrganizacionales = await query.getMany()
    const total = await query.getCount()
    return [unidadesOrganizacionales, total]
  }

  async getDescendientes(idUnidadOrganizacional: string) {
    const parent = await this.buscarPorId(+idUnidadOrganizacional)

    if (parent) {
      const result = await this.dataSource
        .getTreeRepository(UnidadOrganizacional)
        .findDescendantsTree(parent)
      return this.selectTrees(result)
    }
  }

  async arbolDeUnidadesOrganizacionales() {
    const result = await this.dataSource.manager
      .getTreeRepository(UnidadOrganizacional)
      .findTrees()
    return this.mapPropertiesTree(result)
  }

  protected mapPropertiesTree(result: UnidadOrganizacional[]) {
    const selected = result.map((unidadOrganizacional) => {
      return this.selectTrees(unidadOrganizacional)
    })
    return selected
  }

  protected selectTrees(element) {
    for (let i = 0; i < element.hijos.length; i++) {
      element.hijos[i] = this.selectTrees(element.hijos[i])
    }
    return {
      id: element.id,
      nombre: element.nombre,
      sigla: element.sigla,
      nivel: element.nivel,
      hijos: element.hijos,
    }
  }

  protected async getNodoRaiz() {
    const root = await this.dataSource.manager
      .getTreeRepository(UnidadOrganizacional)
      .findTrees({ depth: 1 })
    return root[0]
  }

  protected async campoUnico(
    campo: string,
    nombreBuscado: string
  ): Promise<boolean> {
    const count = await this.dataSource
      .getRepository(UnidadOrganizacional)
      .createQueryBuilder('unidadOrganizacional')
      .where(`unaccent(unidadOrganizacional.${campo}) = unaccent(:nombre)`, {
        nombre: nombreBuscado,
      })
      .getCount()

    if (count > 0) return false

    return true
  }

  async crear(
    unidadOrganizacionalDto: CrearUnidadOrganizacionalDto,
    usuarioAuditoria: string
  ) {
    const rootPrincipal = await this.getNodoRaiz()
    const { nombre, sigla } = unidadOrganizacionalDto
    const nombreUnico = await this.campoUnico('nombre', nombre)
    const siglaUnica = await this.campoUnico('sigla', sigla)

    if (!nombreUnico) {
      throw new BadRequestException('El nombre debe ser unico')
    } else if (!siglaUnica) {
      throw new BadRequestException('La sigla debe ser unica')
    }

    if (!rootPrincipal) {
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIZACIONTAL_ROOT_FOUND
      )
    }

    const { dependencia } = unidadOrganizacionalDto
    const padre = dependencia
      ? await this.getDependenciaPorId(dependencia.id)
      : rootPrincipal

    const result = await this.dataSource.manager.transaction(
      async (transactionManager) => {
        try {
          const unidadOrganizacional = UnidadOrganizacional.create({
            nivel: padre.nivel + 1,
            nombre: nombre,
            sigla: sigla,
            usuarioCreacion: usuarioAuditoria,
            dependencia: padre,
          })
          return await this.crearHijosUnidadOrganizacional(
            unidadOrganizacional,
            unidadOrganizacionalDto,
            transactionManager
          )
        } catch (error) {
          throw new BadRequestException(
            UnidadOrganizacionalMessages.UNIDAD_ORGANIZACIONAL_CREATE_FAILED
          )
        }
      }
    )
    return result
  }

  protected async getDependenciaPorId(id: string) {
    const dependencia = await this.buscarPorId(+id)
    if (!dependencia)
      throw new NotFoundException(
        UnidadOrganizacionalMessages.ORGANIZACIONTAL_UNIT_NOT_FOUND
      )
    return dependencia
  }

  async crearHijosUnidadOrganizacional(parent, parentDto, transactionManager) {
    await transactionManager
      .getTreeRepository(UnidadOrganizacional)
      .save(parent)
    if (!parentDto.hijos) return
    for (const hijo of parentDto.hijos) {
      const unidadOrganizacional = UnidadOrganizacional.create({
        nivel: hijo.nivel,
        nombre: hijo.nombre,
        dependencia: parent,
        sigla: hijo.sigla,
        usuarioCreacion: parent.usuarioCreacion,
      })
      await this.crearHijosUnidadOrganizacional(
        unidadOrganizacional,
        hijo,
        transactionManager
      )
    }
  }

  async eliminarNodoHijo(id: string) {
    const rootPrincipal = await this.getNodoRaiz()
    if (rootPrincipal.id === id) {
      throw new BadRequestException(
        UnidadOrganizacionalMessages.ROOT_NOT_BE_DELETED
      )
    }
    const nodo = await this.getDescendientes(id)
    if (nodo?.hijos.length) {
      throw new BadRequestException(UnidadOrganizacionalMessages.HAS_CHILDRENS)
    }
    const unidadOrganizacional = await this.buscarPorIdEnAsignacionPuestos(+id)
    if (unidadOrganizacional?.asignacionesDePuestos?.length) {
      throw new BadRequestException(
        UnidadOrganizacionalMessages.DEPENDED_ON_OTHER_TABLE
      )
    }
    return await this.eliminar(id)
  }

  async buscarPorIdEnAsignacionPuestos(id: number) {
    return await this.dataSource
      .getRepository(UnidadOrganizacional)
      .createQueryBuilder('unidadOrganizacional')
      .leftJoinAndSelect(
        'unidadOrganizacional.asignacionesDePuestos',
        'asignacionesDePuestos'
      )
      .where({ id })
      .getOne()
  }

  async pedirRelaciones(
    id: string,
    relacion: AsignacionDePuestos | UnidadOrganizacional,
    nombreRelacion: string,
    foreingKey: string
  ) {
    const query = this.dataSource
      .getRepository(typeof relacion)
      .createQueryBuilder(nombreRelacion)
      .leftJoinAndSelect(`${nombreRelacion}.${foreingKey}`, `${foreingKey}`)
      .select([`${nombreRelacion}.id`, `${foreingKey}`])
      .where(
        `${nombreRelacion}.id${(typeof UnidadOrganizacional).toString()} = :id`,
        { id }
      )
    return query.getMany()
  }

  async eliminar(IdUnidadOrganizacional: string) {
    this.dataSource
      .getRepository(UnidadOrganizacional)
      .delete(IdUnidadOrganizacional)
  }
}
