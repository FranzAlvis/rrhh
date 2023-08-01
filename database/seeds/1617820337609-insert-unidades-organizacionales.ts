import { MigrationInterface, QueryRunner } from 'typeorm'
import { UnidadOrganizacional } from '../../src/application/estructura-organizacional/entity/unidad-organizacional.entity'
import { USUARIO_SISTEMA } from '../../src/common/constants'

export class insertUnidadesOrganizacionales1617820337609
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nivel: 3,
        nombre: 'DIRECCION GENERAL EJECUTIVA',
        sigla: 'DGE',
        asignacionesDePuestos: [],
        hijos: [],
      },
    ]
    const registerChild = async (parent, item) => {
      if (!parent) return null
      await queryRunner.manager.save(parent)
      if (!item.hijos) return
      for (const hijo of item.hijos) {
        const child = new UnidadOrganizacional({
          nivel: hijo.nivel,
          nombre: hijo.nombre,
          sigla: hijo.sigla,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          usuarioCreacion: USUARIO_SISTEMA,
          dependencia: parent,
        })
        await registerChild(child, hijo)
      }
    }

    const registar = async (items) => {
      for (const item of items) {
        const parent = new UnidadOrganizacional()
        parent.nivel = item.nivel
        parent.nombre = item.nombre
        parent.sigla = item.sigla
        parent.estado = 'ACTIVO'
        parent.transaccion = 'SEEDS'
        parent.usuarioCreacion = USUARIO_SISTEMA
        await registerChild(parent, item)
      }
    }
    await registar(items)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
