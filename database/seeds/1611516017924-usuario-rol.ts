import { UsuarioRol } from '../../src/core/authorization/entity/usuario-rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'

export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '1',
        rol: '1',
        usuario: '1',
      },
      {
        id: '2',
        rol: '2',
        usuario: '2',
      },
      {
        id: '3',
        rol: '3',
        usuario: '3',
      },
    ]
    const usuariosRoles = items.map((item) => {
      return new UsuarioRol({
        idRol: item.rol,
        idUsuario: item.usuario,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(usuariosRoles)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
