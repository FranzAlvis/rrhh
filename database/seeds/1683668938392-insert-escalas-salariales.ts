import { CrearEscalaSalarialDto } from 'src/application/estructura-organizacional/dto/crear-escala-salarial.dto'
import { EscalaSalarial } from 'src/application/estructura-organizacional/entity/escala-salarial.entity'
import { Parametro } from 'src/application/parametro/parametro.entity'
import { USUARIO_SISTEMA } from 'src/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertEscalasSalariales1683668938392
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ITEM =
      (await queryRunner.manager.findOne(Parametro, {
        where: {
          codigo: 'ITEM',
        },
      })) ?? new Parametro()

    // Extension para el uso unaccent
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS unaccent')

    const items: CrearEscalaSalarialDto[] = [
      {
        nivel_salarial: 1,
        denominacion_puesto: 'DIRECTOR GENERAL EJECUTIVO',
        sueldo_haber_mensual: 19535.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 2,
        denominacion_puesto: 'JEFE DE UNIDAD',
        sueldo_haber_mensual: 17579.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 3,
        denominacion_puesto: 'RESPONSABLE I',
        sueldo_haber_mensual: 15592.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 4,
        denominacion_puesto: 'RESPONSABLE II',
        sueldo_haber_mensual: 14933.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 5,
        denominacion_puesto: 'PROFESIONAL I',
        sueldo_haber_mensual: 13738.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 6,
        denominacion_puesto: 'PROFESIONAL II',
        sueldo_haber_mensual: 12995.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 7,
        denominacion_puesto: 'PROFESIONAL III',
        sueldo_haber_mensual: 11362.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 8,
        denominacion_puesto: 'PROFESIONAL IV',
        sueldo_haber_mensual: 10693.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 9,
        denominacion_puesto: 'PROFESIONAL V',
        sueldo_haber_mensual: 9282.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 10,
        denominacion_puesto: 'TÉCNICO I',
        sueldo_haber_mensual: 8689.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 11,
        denominacion_puesto: 'TÉCNICO II',
        sueldo_haber_mensual: 7722.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 12,
        denominacion_puesto: 'TÉCNICO III',
        sueldo_haber_mensual: 6906.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 13,
        denominacion_puesto: 'TÉCNICO IV',
        sueldo_haber_mensual: 5971.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 14,
        denominacion_puesto: 'TÉCNICO V',
        sueldo_haber_mensual: 5494.0,
        tipo: ITEM,
      },
      {
        nivel_salarial: 15,
        denominacion_puesto: 'TÉCNICO VI',
        sueldo_haber_mensual: 4827.0,
        tipo: ITEM,
      },
    ]

    for (const item of items) {
      const escalaSalarial = new EscalaSalarial()
      escalaSalarial.nivel_salarial = item.nivel_salarial
      escalaSalarial.denominacion_puesto = item.denominacion_puesto
      escalaSalarial.sueldo_haber_mensual = item.sueldo_haber_mensual
      escalaSalarial.usuarioCreacion = USUARIO_SISTEMA
      escalaSalarial.asignacionesDePuestos = []
      escalaSalarial.tipo = item.tipo
      await queryRunner.manager.save(escalaSalarial)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
