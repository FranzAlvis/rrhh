import dayjs from 'dayjs'
import { Feriados } from 'src/application/feriados/entity/feriados.entity'
import { USUARIO_SISTEMA } from 'src/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertFeriados1685456689243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'Año Nuevo',
        fecha: '2023-01-01',
      },
      {
        nombre: 'Estado Plurinacional',
        fecha: '2023-01-22',
      },
      {
        nombre: 'Día del Trabajador',
        fecha: '2023-05-01',
      },
      {
        nombre: 'Año Nuevo Aymara o Andino',
        fecha: '2023-06-21',
      },
      {
        nombre: 'Día de la Independencia',
        fecha: '2023-08-06',
      },
      {
        nombre: 'Día de los Difuntos',
        fecha: '2023-11-02',
      },
      {
        nombre: 'Navidad',
        fecha: '2023-12-25',
      },
    ]

    for (const item of items) {
      const feriado = new Feriados()
      feriado.nombre = item.nombre
      feriado.fecha = dayjs(item.fecha, 'YYYY-MM-DD').toDate()
      feriado.usuarioCreacion = USUARIO_SISTEMA
      await queryRunner.manager.save(feriado)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
