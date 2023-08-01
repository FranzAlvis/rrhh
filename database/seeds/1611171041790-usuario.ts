import { Usuario } from '../../src/core/usuario/entity/usuario.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { TextService } from '../../src/common/lib/text.service'
import {
  Genero,
  TipoDocumento,
  USUARIO_SISTEMA,
} from '../../src/common/constants'
import dayjs from 'dayjs'
import { Persona } from '../../src/core/usuario/entity/persona.entity'

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = '123'
    const pass = await TextService.encrypt(DEFAULT_PASS)
    const items = [
      {
        usuario: 'administrador',
        correoElectonico: 'agepic-9270815@yopmail.com',
        persona: {
          nombres: 'JUAN',
          usuario: 'jperez',
          primerApellido: 'PEREZ',
          segundoApellido: 'PEREZ',
          tipoDocumento: TipoDocumento.CI,
          correoElectronicoPersonal: 'jperez@yopmail.com',
          nroDocumento: '48918755',
          fechaNacimiento: '2002-02-09',
          telefono: '67667532',
          nroLibretaServicioMilitar: TextService.generateNro(),
          genero: Genero.MASCULINO,
        },
      },
      {
        usuario: 'jefe-rrhh',
        correoElectonico: 'agepic-13977653@yopmail.com',
        persona: {
          nombres: 'FRANCO',
          usuario: 'falba',
          primerApellido: 'ALBA',
          segundoApellido: 'PEÑA',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '48918751',
          fechaNacimiento: '1961-10-21',
          genero: Genero.MASCULINO,
          correoElectronicoPersonal: 'falba@yopmail.com',
          telefono: '63678439',
          nroLibretaServicioMilitar: TextService.generateNro(),
        },
      },
      {
        usuario: 'usuario',
        correoElectonico: 'agepic-13977861@yopmail.com',
        persona: {
          nombres: 'ROBERTO',
          usuario: 'raguilar',
          primerApellido: 'AGUILAR',
          segundoApellido: 'VILLEGAS',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '48918753',
          fechaNacimiento: '1987-05-28',
          correoElectronicoPersonal: 'raguilar@yopmail.com',
          telefono: '79678646',
          nroLibretaServicioMilitar: TextService.generateNro(),
          genero: Genero.FEMENINO,
        },
      },
    ]

    for (const item of items) {
      const persona = new Persona({
        fechaNacimiento: dayjs(
          item.persona.fechaNacimiento,
          'YYYY-MM-DD'
        ).toDate(),
        genero: item.persona.genero,
        nombres: item.persona.nombres,
        nroDocumento: item.persona.nroDocumento,
        primerApellido: item.persona.primerApellido,
        segundoApellido: item.persona.segundoApellido,
        tipoDocumento: item.persona.tipoDocumento,
        correoElectronicoPersonal: item.persona.correoElectronicoPersonal,
        telefono: item.persona.telefono,
        nroLibretaServicioMilitar: item.persona.nroLibretaServicioMilitar,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
      const personaResult = await queryRunner.manager.save(persona)
      const usuario = new Usuario({
        ciudadaniaDigital: false,
        contrasena: pass,
        intentos: 0,
        usuario: item.usuario,
        correoElectronico: item.correoElectonico,
        idPersona: personaResult.id,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
        fechaAsignacionItem: dayjs(
          item.persona.fechaNacimiento,
          'YYYY-MM-DD'
        ).toDate(),
        nroRegistroProfesional: TextService.generateNro(),
        profesion: 'PROFESIÓN DEL USUARIO',
        nroFuncionarioCarrera: TextService.generateNro(),
      })
      await queryRunner.manager.save(usuario)
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
