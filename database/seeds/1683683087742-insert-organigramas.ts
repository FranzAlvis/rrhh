import { Organigrama } from 'src/application/estructura-organizacional/entity/organigrama.entity'
import { USUARIO_SISTEMA } from 'src/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertOrganigramas1683683087742 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        version: '1',
        gestion: 2023,
        asignacionesDePuestos: [],
      },
      {
        version: '1',
        gestion: 2022,
        asignacionesDePuestos: [],
      },
      {
        version: '1',
        gestion: 2021,
        asignacionesDePuestos: [],
      },
      {
        version: '1',
        gestion: 2020,
        asignacionesDePuestos: [],
      },
    ]

    for (const item of items) {
      const organigrama = new Organigrama()
      organigrama.version = item.version
      organigrama.gestion = item.gestion
      organigrama.usuarioCreacion = USUARIO_SISTEMA
      organigrama.asignacionesDePuestos = []
      await queryRunner.manager.save(organigrama)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
