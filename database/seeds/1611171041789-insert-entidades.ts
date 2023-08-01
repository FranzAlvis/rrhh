import { Entidad } from 'src/application/estructura-organizacional/entity/entidad.entity'
import { USUARIO_SISTEMA } from 'src/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertEntidades1611171041789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre:
          '374 AGENCIA DE GOBIERNO ELECTRONICO Y TECNOLOGIAS DE INFORMACION Y COMUNICACION',
        fuente: '41 TRANSFERENCIA T.G.N',
        organismo: '111 TESORO GENERAL DE LA NACION',
        _transaccion: 'SEEDS',
      },
    ]
    const Entidades = items.map((item) => {
      return new Entidad({
        nombre: item.nombre,
        fuente: item.fuente,
        organismo: item.organismo,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(Entidades)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
