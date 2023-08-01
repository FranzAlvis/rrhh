import {
  Modulo,
  Propiedades,
} from '../../src/core/authorization/entity/modulo.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'

export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // MENU SECCION PRINCIPAL
      {
        nombre: 'Principal',
        url: '/principal',
        label: 'Principal',
        propiedades: {
          descripcion: 'Sección principal',
          orden: 1,
        },
        subMenus: [
          {
            nombre: 'inicio',
            url: '/admin/home',
            label: 'Inicio',
            propiedades: {
              icono: 'home',
              descripcion:
                'Vista de bienvenida con características del sistema',
              orden: 1,
            },
          },
          {
            nombre: 'perfil',
            url: '/admin/perfil',
            label: 'Perfil',
            propiedades: {
              icono: 'person',
              descripcion:
                'Información del perfil de usuario que inicio sesión',
              orden: 2,
            },
          },
        ],
      },
      // MENU SECCION CONFIGURACIONES
      {
        nombre: 'configuraciones',
        url: '/configuraciones',
        label: 'Configuración',
        propiedades: {
          descripcion: 'Sección de configuraciones',
          orden: 2,
        },
        subMenus: [
          {
            nombre: 'usuarios',
            url: '/admin/usuarios',
            label: 'Usuarios',
            propiedades: {
              icono: 'manage_accounts',
              descripcion: 'Control de usuarios del sistema',
              orden: 1,
            },
          },
          {
            nombre: 'parametros',
            url: '/admin/parametros',
            label: 'Parámetros',
            propiedades: {
              icono: 'tune',
              descripcion: 'Parámetros generales del sistema',
              orden: 2,
            },
          },
          {
            nombre: 'modulos',
            url: '/admin/modulos',
            label: 'Módulos',
            propiedades: {
              icono: 'widgets',
              descripcion: 'Gestión de módulos',
              orden: 3,
            },
          },
          {
            nombre: 'politicas',
            url: '/admin/politicas',
            label: 'Políticas',
            propiedades: {
              icono: 'verified_user',
              descripcion: 'Control de permisos para los usuarios',
              orden: 4,
            },
          },
          {
            nombre: 'rol',
            url: '/admin/roles',
            label: 'Roles',
            propiedades: {
              icono: 'admin_panel_settings',
              descripcion: 'Control de roles para los usuarios',
              orden: 5,
            },
          },
          {
            nombre: 'feriados',
            url: '/admin/feriados',
            label: 'Feriados',
            propiedades: {
              icono: 'event',
              descripcion: 'Gestión de feriados',
              orden: 6,
            },
          },
          {
            nombre: 'entidades',
            url: '/admin/entidades',
            label: 'Entidades',
            propiedades: {
              icono: 'apartment',
              descripcion: 'Control de Entidades',
              orden: 6,
            },
          },
          {
            nombre: 'unidades-organizacionales',
            url: '/admin/unidades-organizacionales',
            label: 'Unidades Organizacionales',
            propiedades: {
              icono: 'account_tree',
              descripcion: 'Unidades organizacionales del sistema',
              orden: 7,
            },
          },
          {
            nombre: 'escalas-salariales',
            url: '/admin/escalas-salariales',
            label: 'Escalas Salariales',
            propiedades: {
              icono: 'request_quote',
              descripcion: 'Control de Escalas Salariales',
              orden: 8,
            },
          },
          {
            nombre: 'organigramas',
            url: '/admin/organigramas',
            label: 'Organigramas',
            propiedades: {
              icono: 'lan',
              descripcion: 'Control de Organigramas',
              orden: 9,
            },
          },
        ],
      },
      //MENU MODULO PERMISOS
      {
        nombre: 'Permisos',
        url: '/permisos',
        label: 'Permisos',
        propiedades: {
          descripcion: 'Sección de permisos',
          orden: 3,
        },
        subMenus: [
          {
            nombre: 'solicitud de permisos',
            url: '/admin/permisos',
            label: 'Solicitud',
            propiedades: {
              icono: 'article',
              descripcion: 'Registro de solicitudes',
              orden: 1,
            },
          },
          {
            nombre: 'tipos de permisos',
            url: '/admin/permisos/tipos-de-permisos',
            label: 'Tipo de permiso',
            propiedades: {
              icono: 'checklist',
              descripcion: 'Registro de tipos de permisos',
              orden: 2,
            },
          },
          {
            nombre: 'justificaciones',
            url: '/admin/permisos/justificaciones',
            label: 'Justificacion',
            propiedades: {
              icono: 'summarize',
              descripcion: 'Registro de justificaciones',
              orden: 3,
            },
          },
        ],
      },

      //MENU MODULO ESTRUCTURA ORGANIZACIONAL
      {
        nombre: 'Estructura organizacionales',
        url: '/estructura-organizacional',
        label: 'Estructura Organizacional',
        propiedades: {
          descripcion: 'Sección de Estructura Organizacionales',
          orden: 4,
        },
        subMenus: [
          {
            nombre: 'unidades-organizacionales',
            url: '/estructura-organizacional/unidades-organizacionales',
            label: 'Unidades Organizacionales',
            propiedades: {
              icono: 'account_tree',
              descripcion: 'Unidades organizacionales del sistema',
              orden: 1,
            },
          },
          {
            nombre: 'escalas-salariales',
            url: '/estructura-organizacional/escalas-salariales',
            label: 'Escalas Salariales',
            propiedades: {
              icono: 'request_quote',
              descripcion: 'Control de Escalas Salariales',
              orden: 2,
            },
          },
          {
            nombre: 'organigramas',
            url: '/estructura-organizacional/organigramas',
            label: 'Organigramas',
            propiedades: {
              icono: 'lan',
              descripcion: 'Control de Organigramas',
              orden: 3,
            },
          },
        ],
      },
    ]

    for (const item of items) {
      const propiedades: Propiedades = {
        orden: item.propiedades.orden,
        descripcion: item.propiedades.descripcion,
      }
      const modulo = await queryRunner.manager.save(
        new Modulo({
          nombre: item.nombre,
          url: item.url,
          label: item.label,
          propiedades: propiedades,
          estado: item.url.includes('/estructura-organizacional')
            ? 'INACTIVO'
            : 'ACTIVO',
          transaccion: 'SEEDS',
          usuarioCreacion: USUARIO_SISTEMA,
        })
      )

      for (const subMenu of item.subMenus) {
        const propiedad: Propiedades = {
          icono: subMenu.propiedades.icono,
          descripcion: subMenu.propiedades.descripcion,
          orden: subMenu.propiedades.orden,
        }
        await queryRunner.manager.save(
          new Modulo({
            nombre: subMenu.nombre,
            url: subMenu.url,
            label: subMenu.label,
            idModulo: modulo.id,
            propiedades: propiedad,
            estado: item.url.includes(
              '/estructura-organizacional/unidades-organizacionales'
            )
              ? 'INACTIVO'
              : 'ACTIVO',
            transaccion: 'SEEDS',
            usuarioCreacion: USUARIO_SISTEMA,
          })
        )
      }
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
