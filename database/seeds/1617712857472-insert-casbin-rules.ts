import { CasbinRule } from '../../src/core/authorization/entity/casbin.entity'
import { RolEnum } from '../../src/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const frontendRoutes: CasbinValue = {
      '/admin/usuarios': {
        [RolEnum.ADMINISTRADOR]: 'read|update|create|delete',
      },
      '/admin/parametros': {
        [RolEnum.ADMINISTRADOR]: 'read|update|create',
      },
      '/admin/modulos': {
        [RolEnum.ADMINISTRADOR]: 'read|update|create',
      },
      '/admin/politicas': {
        [RolEnum.ADMINISTRADOR]: 'create|read|update|delete',
      },
      '/admin/perfil': {
        [RolEnum.ADMINISTRADOR]: 'read|update',
        [RolEnum.USUARIO]: 'read|update',
        [RolEnum.JEFE_RRHH]: 'read',
      },
      '/admin/home': {
        [RolEnum.ADMINISTRADOR]: 'read',
        [RolEnum.USUARIO]: 'read',
        [RolEnum.JEFE_RRHH]: 'read',
      },
      '/admin/roles': {
        [RolEnum.ADMINISTRADOR]: 'read|create|update|delete',
      },
      '/admin/feriados': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/estructura-organizacional/entidades': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/admin/permisos': {
        [RolEnum.JEFE_RRHH]: 'read|update',
        [RolEnum.USUARIO]: 'read|create|update|delete',
      },
      '/admin/permisos/tipos-de-permisos': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/admin/permisos/justificaciones': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/admin/entidades': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/admin/unidades-organizacionales': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/admin/escalas-salariales': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/admin/organigramas': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/admin/organigrama/:id': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/estructura-organizacional/unidades-organizacionales': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/estructura-organizacional/escalas-salariales': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
      '/estructura-organizacional/organigramas': {
        [RolEnum.JEFE_RRHH]: 'read|create|update|delete',
      },
    }

    const backendRoutes: CasbinValue = {
      '/api/autorizacion/politicas': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },
      '/api/autorizacion/modulos': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },
      '/api/autorizacion/modulos/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/autorizacion/modulos/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },
      '/api/autorizacion/modulos/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },
      '/api/autorizacion/roles': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/autorizacion/roles/todos': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/autorizacion/roles/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/autorizacion/roles/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/autorizacion/roles/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/usuarios/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios/:id/restauracion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios/:id/reenviar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios/listar-consultores': {
        [RolEnum.ADMINISTRADOR]: 'GET',
      },
      '/api/parametros': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/parametros/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/parametros/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/parametros/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/parametros/:grupo/listado': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/autorizacion/permisos': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/usuarios/cuenta/perfil': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/usuarios/cuenta/contrasena': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/usuarios/listar-para-permisos': {
        [RolEnum.USUARIO]: 'GET',
      },
      '/api/permisos': {
        [RolEnum.JEFE_RRHH]: 'GET|PATCH',
        [RolEnum.USUARIO]: 'GET|POST|PATCH',
      },
      '/api/permisos/todos': {
        [RolEnum.JEFE_RRHH]: 'GET|PATCH',
        [RolEnum.USUARIO]: 'GET|POST|PATCH',
      },
      '/api/permisos/:id': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
        [RolEnum.USUARIO]: 'PATCH',
      },
      '/api/permisos/:id/activacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/permisos/:id/inactivacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
        [RolEnum.USUARIO]: 'PATCH',
      },
      '/api/permisos/tipos-de-permisos': {
        [RolEnum.JEFE_RRHH]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/api/permisos/tipos-de-permisos/todos': {
        [RolEnum.JEFE_RRHH]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/api/permisos/tipos-de-permisos/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|PATCH|DELETE',
        [RolEnum.USUARIO]: 'GET',
      },
      '/api/permisos/tipos-de-permisos/:id/activacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/permisos/tipos-de-permisos/:id/inactivacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/permisos/justificaciones': {
        [RolEnum.JEFE_RRHH]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/api/permisos/justificaciones/todos': {
        [RolEnum.JEFE_RRHH]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/api/permisos/justificaciones/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|PATCH',
        [RolEnum.USUARIO]: 'GET',
      },
      '/api/permisos/justificaciones/:id/activacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/permisos/justificaciones/:id/inactivacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/unidades-organizacionales': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/unidades-organizacionales/arbol': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/unidades-organizacionales/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/unidades-organizacionales/:id/activacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/unidades-organizacionales/:id/inactivacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/unidades-organizacionales/:id/dependientes': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/unidades-organizacionales/todo': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/asignacion-de-puestos': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/asignacion-de-puestos/ultimo/numeroitem': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/asignacion-de-puestos/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|PATCH|DELETE',
      },
      '/api/asignacion-de-puestos/:id/listar': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/asignacion-de-puestos/:id/listar-todo': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/asignacion-de-puestos/:id/activacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/asignacion-de-puestos/:id/inactivacion': {
        [RolEnum.JEFE_RRHH]: 'PATCH',
      },
      '/api/entidades': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/entidades/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/entidades/entidades': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/escalas-salariales': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/escalas-salariales/todo': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/escalas-salariales/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/organigramas': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|DELETE|PATCH',
      },
      '/api/unidades-organizacionales-aprobados': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/escalas-salariales-aprobados': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/asignacion-puestos-aprobados': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/organigramas/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|DELETE|PATCH',
      },
      '/api/organigramas/:id/aprobar': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/organigramas/:id/revision': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/organigramas/:id/rechazar': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/organigramas/ultimo/version': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/feriados': {
        [RolEnum.JEFE_RRHH]: 'GET|POST',
      },
      '/api/feriados/:id': {
        [RolEnum.JEFE_RRHH]: 'GET|POST|PATCH|DELETE',
      },
      '/api/feriados/nombres': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/feriados/fechas': {
        [RolEnum.JEFE_RRHH]: 'GET',
      },
      '/api/asignacion-de-puestos/gestion-actual': {
        [RolEnum.ADMINISTRADOR]: 'GET',
      },
    }

    const registrarCasbin = async (
      valoresCasbin: CasbinValue,
      tipo: string
    ) => {
      for (const routePath of Object.keys(valoresCasbin)) {
        const rolNameList = Object.keys(valoresCasbin[routePath])
        for (const rolName of rolNameList) {
          const action = valoresCasbin[routePath][rolName]
          const datosRegistro = new CasbinRule({
            ptype: 'p',
            v0: rolName,
            v1: routePath,
            v2: action,
            v3: tipo,
          })
          await queryRunner.manager.save(datosRegistro)
        }
      }
    }

    await registrarCasbin(frontendRoutes, 'frontend')
    await registrarCasbin(backendRoutes, 'backend')
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

export type RouteItem = {
  [key: string]: string
}

export type CasbinValue = {
  [key: string]: RouteItem
}
