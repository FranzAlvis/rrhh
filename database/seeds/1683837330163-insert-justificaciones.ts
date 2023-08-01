import { Justificacion } from 'src/application/justificacion/entities/justificacion.entity'
import { TipoPermiso } from 'src/application/tipo_permiso/entities/tipo_permiso.entity'
import { USUARIO_SISTEMA } from 'src/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { insertItemsTipoPermiso } from './1683837259537-insert-tipo-permiso'

export class insertJustificaciones1683837330163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const itemsJustificacion = [
      {
        // id: '1',
        nombre: 'PERMISO OFICIAL POR HORAS',
        descripcion: 'PERMISO OFICIAL POR HORAS',
        tipoPermisoId: '1',
      },
      {
        // id: '2',
        nombre: 'ASUETO',
        descripcion: 'ASUETO',
        tipoPermisoId: '1',
      },
      {
        // id: '3',
        nombre: 'TOLERANCIA',
        descripcion: 'TOLERANCIA',
        tipoPermisoId: '1',
      },
      {
        // id: '4',
        nombre:
          'ATENCIÓN MÉDICA DEL BENEFICIARIO A FAMILIARES Y PERSONAS A SU CARGO',
        descripcion:
          'ATENCIÓN MÉDICA DEL BENEFICIARIO A FAMILIARES Y PERSONAS A SU CARGO',
        tipoPermisoId: '3',
      },
      {
        // id: '5',
        nombre: 'ATENCIÓN A CURSOS SEMINARIOS U OTRAS ACTIVIDADES SIMILARES',
        descripcion:
          'ATENCIÓN A CURSOS SEMINARIOS U OTRAS ACTIVIDADES SIMILARES',
        tipoPermisoId: '3',
      },
      {
        // id: '6',
        nombre:
          ' PARTICIPACIÓN ARTÍSTICA O PERSONAL EN DEPORTIVOS, ACTIVIDADES DE ALCANCE CULTURALES, ACADÉMICAS, INTERNACIONAL…',
        descripcion:
          ' PARTICIPACIÓN ARTÍSTICA O PERSONAL EN DEPORTIVOS, ACTIVIDADES DE ALCANCE CULTURALES, ACADÉMICAS, INTERNACIONAL…',
        tipoPermisoId: '3',
      },
      {
        // id: '7',
        nombre: 'ASUNTOS PERSONALES',
        descripcion: 'ASUNTOS PERSONALES',
        tipoPermisoId: '3',
      },
      {
        // id: '8',
        nombre: 'VACACIONES PROGRAMADAS',
        descripcion: 'VACACIONES PROGRAMADAS',
        tipoPermisoId: '5',
      },
      {
        // id: '9',
        nombre: 'REPROGRAMACIÓN DE VACACIONES',
        descripcion: 'REPROGRAMACIÓN DE VACACIONES',
        tipoPermisoId: '5',
      },
      {
        // id: '10',
        nombre: 'BAJA PRENATAL - POST NATAL',
        descripcion: 'BAJA PRENATAL - POST NATAL',
        tipoPermisoId: '4',
      },
      {
        // id: '11',
        nombre: 'BAJA MÉDICA',
        descripcion: 'BAJA MÉDICA',
        tipoPermisoId: '4',
      },
      {
        // id: '12',
        nombre: 'MATRIMONIO',
        descripcion: 'MATRIMONIO',
        tipoPermisoId: '4',
      },
      {
        // id: '13',
        nombre: 'FALLECIMIENTO DE PADRES, CONYUGE',
        descripcion: 'FALLECIMIENTO DE PADRES, CONYUGE',
        tipoPermisoId: '4',
      },
      {
        // id: '14',
        nombre: 'NACIMIENTO DE HIJOS',
        descripcion: 'NACIMIENTO DE HIJOS',
        tipoPermisoId: '4',
      },
      {
        // id: '15',
        nombre: 'POR ACCIDENTE O ENFERMEDAD GRAVE',
        descripcion: 'POR ACCIDENTE O ENFERMEDAD GRAVE',
        tipoPermisoId: '4',
      },
      {
        // id: '16',
        nombre: 'ASUNTOS PERSONALES (MÁXIMO 2 DÍAS HÁBILES EN EL AÑO)',
        descripcion: 'ASUNTOS PERSONALES (MÁXIMO 2 DÍAS HÁBILES EN EL AÑO)',
        tipoPermisoId: '4',
      },
      {
        // id: '17',
        nombre: 'OTROS',
        descripcion: 'OTROS',
        tipoPermisoId: '2',
      },
      {
        // id: '17',
        nombre: 'OTROS',
        descripcion: 'OTROS',
        tipoPermisoId: '6',
      },
    ]
    for (const item of insertItemsTipoPermiso) {
      const tipoPermiso = new TipoPermiso({
        sigla: item.sigla,
        nombre: item.nombre,
        descripcion: item.descripcion,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
      const resultTipoPermiso = await queryRunner.manager.save(tipoPermiso)
      for (const item of itemsJustificacion) {
        if (resultTipoPermiso.id === item.tipoPermisoId) {
          const justificacion = new Justificacion({
            nombre: item.nombre,
            descripcion: item.descripcion,
            idTipoPermiso: resultTipoPermiso.id,
            estado: 'ACTIVO',
            transaccion: 'SEEDS',
            usuarioCreacion: USUARIO_SISTEMA,
          })
          await queryRunner.manager.save(justificacion)
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
