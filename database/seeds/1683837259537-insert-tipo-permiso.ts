import { MigrationInterface, QueryRunner } from 'typeorm'

export const insertItemsTipoPermiso = [
  {
    // id: 1,
    sigla: 'P.O.',
    nombre: 'PERMISO OFICIAL',
    descripcion: 'PERMISO OFICIAL',
  },
  {
    // id: 2,
    sigla: 'P.P.G.H',
    nombre: 'CON GOCE DE HABERES',
    descripcion: 'CON GOCE DE HABERES',
  },
  {
    // id: 3,
    sigla: 'P.P.S.G.H',
    nombre: 'SIN GOCE DE HABERES',
    descripcion: 'SIN GOCE DE HABERES',
  },
  {
    // id: 4,
    sigla: 'L',
    nombre: 'LICENCIAS',
    descripcion: 'LICENCIAS',
  },
  {
    // id: 5,
    sigla: 'V',
    nombre: 'VACACIONES',
    descripcion: 'VACACIONES',
  },
  {
    // id: 6,
    sigla: 'O',
    nombre: 'OTROS',
    descripcion: 'OTROS',
  },
]
export class tipoPermiso1683837259537 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async up(queryRunner: QueryRunner): Promise<void> {}

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
