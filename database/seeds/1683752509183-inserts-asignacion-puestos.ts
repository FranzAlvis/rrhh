import { MigrationInterface, QueryRunner } from 'typeorm'
import { AsignacionDePuestos } from '../../src/application/estructura-organizacional/entity/asignacion-de-puestos.entity'
import { USUARIO_SISTEMA } from '../../src/common/constants'
export class insertsAsignacionPuestos1683752509183
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nivel: 1,
        descripcion_puesto: 'DIRECTOR GENERAL EJECUTIVO',
        nro_item: 1,
        cargo: 1,
        id_unidades_organizacionales: 1,
        id_organigrama: 1,
        id_escala_salarial: 1,
      },
    ]
    const asignacionesDePuestos = items.map((item) => {
      return new AsignacionDePuestos({
        nivel: item.nivel,
        descripcion_puesto: item.descripcion_puesto,
        nro_item: item.nro_item,
        cargo: item.cargo,
        idEscalaSalarial: item.id_escala_salarial,
        idOrganigrama: item.id_organigrama,
        idUnidadOrganizacional: item.id_unidades_organizacionales,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(asignacionesDePuestos)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
