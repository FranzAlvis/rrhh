import { RolEnum } from '../../src/core/authorization/rol.enum'
import { Rol } from '../../src/core/authorization/entity/rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'

export class rol1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: RolEnum.ADMINISTRADOR,
        nombre: 'Administrador',
      },
      {
        rol: RolEnum.JEFE_RRHH,
        nombre: 'Jefe de Recursos Humanos',
      },
      {
        rol: RolEnum.USUARIO,
        nombre: 'Usuario',
      },
    ]
    const roles = items.map((item) => {
      return new Rol({
        rol: item.rol,
        nombre: item.nombre,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(roles)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
