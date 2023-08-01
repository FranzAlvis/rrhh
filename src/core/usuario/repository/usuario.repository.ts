import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { TextService } from '../../../common/lib/text.service'
import { Rol } from '../../authorization/entity/rol.entity'
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity'
import { Persona } from '../entity/persona.entity'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'
import { Usuario } from '../entity/usuario.entity'
import { PersonaDto } from '../dto/persona.dto'
import { Status } from '../../../common/constants'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Brackets, DataSource, EntityManager } from 'typeorm'
import { ActualizarUsuarioDto } from '../dto/actualizar-usuario.dto'
import dayjs from 'dayjs'
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto'
import { AsignacionDePuestos } from 'src/application/estructura-organizacional/entity/asignacion-de-puestos.entity'
import { UnidadOrganizacionalMessages } from 'src/common/constants/unidad.organizacional.messages'
import { UsuarioAsignacionPuesto } from 'src/application/estructura-organizacional/entity/usuario-asignacion-puesto.entity'
import { EscalaSalarial } from 'src/application/estructura-organizacional/entity/escala-salarial.entity'

@Injectable()
export class UsuarioRepository {
  constructor(private dataSource: DataSource) {}

  async listar(paginacionQueryDto: FiltrosUsuarioDto) {
    const { limite, saltar, filtro, rol } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuario.profesion',
        'usuario.fechaAsignacionItem',
        'usuario.nroRegistroProfesional',
        'usuario.nroFuncionarioCarrera',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.fechaNacimiento',
        'persona.tipoDocumento',
        'persona.correoElectronicoPersonal',
        'persona.telefono',
        'persona.nroLibretaServicioMilitar',
        'persona.genero',
      ])
      .where('usuarioRol.estado = :estado', { estado: Status.ACTIVE })
      .take(limite)
      .skip(saltar)
      .orderBy('usuario.id', 'ASC')

    if (rol) {
      query.andWhere('rol.id IN(:...roles)', {
        roles: rol,
      })
    }
    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('usuario.usuario ilike :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('persona.nroDocumento ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.nombres ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.primerApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.segundoApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async recuperar() {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany()
  }

  async buscarUsuario(usuario: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('usuario.usuario like LOWER(:usuario)', {
        usuario: usuario.toLowerCase(),
      })
      .getOne()
  }

  async buscarUsuarioPorNombreUsuario(usuario: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .where({ usuario })
      .getOne()
  }

  async buscarPorId(id: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(Usuario) ??
      this.dataSource.getRepository(Usuario)
    )
      .createQueryBuilder('usuario')
      .where({ id: id })
      .getOne()
  }

  async buscarUsuarioRolPorId(id: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.contrasena',
        'usuario.estado',
        'usuario.profesion',
        'usuario.fechaAsignacionItem',
        'usuario.nroRegistroProfesional',
        'usuario.nroFuncionarioCarrera',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.tipoDocumento',
        'persona.correoElectronicoPersonal',
        'persona.telefono',
        'persona.nroLibretaServicioMilitar',
        'persona.genero',
        'persona.nroDocumento',
        'persona.fechaNacimiento',
        'usuarioRol',
        'rol',
      ])
      .where({ id })
      .getOne()
  }

  async buscarUsuarioPorCI(persona: PersonaDto) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('persona.nroDocumento = :ci', { ci: persona.nroDocumento })
      .getOne()
  }

  async verificarExisteUsuarioPorCI(ci: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoin('usuario.persona', 'persona')
      .select('usuario.id')
      .where('persona.nroDocumento = :ci', { ci: ci })
      .getOne()
  }

  async buscarAsingacionDePuestoPorId(id: string, transaction) {
    return await transaction
      .getRepository(AsignacionDePuestos)
      .createQueryBuilder('asignacionDePuestos')
      .where({ id })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(
          UnidadOrganizacionalMessages.ASIGNACION_PUESTO_NOT_FOUND
        )
      })
  }

  async buscarUsuarioPorCorreo(correo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .where('usuario.correoElectronico = :correo', { correo })
      .getOne()
  }

  protected async guardarUsuarioAsignacinDePuestos(
    idAsignaciondePuestos: Set<string> | undefined,
    idUsuario: string,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    if (!idAsignaciondePuestos) return
    for (const id of idAsignaciondePuestos) {
      const asignacionDePuesto = await this.buscarAsingacionDePuestoPorId(
        id,
        transaction
      )
      await transaction.save(
        UsuarioAsignacionPuesto.create({
          asignacionDePuesto,
          idUsuario,
          usuarioCreacion: usuarioAuditoria,
        })
      )
    }
  }

  async crear(
    usuarioDto: CrearUsuarioDto,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    const personaResult = await transaction.getRepository(Persona).save(
      new Persona({
        nombres: usuarioDto?.persona?.nombres,
        primerApellido: usuarioDto?.persona?.primerApellido,
        segundoApellido: usuarioDto?.persona?.segundoApellido,
        nroDocumento: usuarioDto?.persona?.nroDocumento,
        correoElectronicoPersonal:
          usuarioDto?.persona?.correoElectronicoPersonal,
        fechaNacimiento: usuarioDto?.persona?.fechaNacimiento,
        telefono: usuarioDto?.persona?.telefono,
        tipoDocumento: usuarioDto.persona.tipoDocumento,
        nroLibretaServicioMilitar:
          usuarioDto?.persona?.nroLibretaServicioMilitar,
        genero: usuarioDto?.persona?.genero,
        usuarioCreacion: usuarioAuditoria,
      })
    )

    const usuarioResult = await transaction.getRepository(Usuario).save(
      new Usuario({
        idPersona: personaResult.id,
        usuarioRol: [],
        usuario: usuarioDto.usuario,
        estado: usuarioDto?.estado ?? Status.CREATE,
        correoElectronico: usuarioDto?.correoElectronico,
        contrasena:
          usuarioDto?.contrasena ??
          (await TextService.encrypt(TextService.generateUuid())),
        ciudadaniaDigital: usuarioDto?.ciudadaniaDigital ?? false,
        usuarioCreacion: usuarioAuditoria,
        fechaAsignacionItem: usuarioDto.fechaAsignacionItem,
        profesion: usuarioDto.profesion,
        nroFuncionarioCarrera: usuarioDto.nroFuncionarioCarrera,
        nroRegistroProfesional: usuarioDto.nroRegistroProfesional,
        usuarioAsignacionPuestos: [],
      })
    )

    await this.guardarUsuarioAsignacinDePuestos(
      usuarioDto.asignacionDePuestos,
      usuarioResult.id,
      usuarioAuditoria,
      transaction
    )

    const usuarioRoles: QueryDeepPartialEntity<UsuarioRol>[] =
      usuarioDto.roles.map((idRol) => {
        // Rol
        const rol = new Rol()
        rol.id = idRol

        // UsuarioRol
        const usuarioRol = new UsuarioRol()
        usuarioRol.rol = rol
        usuarioRol.usuarioCreacion = usuarioAuditoria
        usuarioRol.idUsuario = usuarioResult.id

        return usuarioRol
      })

    await transaction
      .createQueryBuilder()
      .insert()
      .into(UsuarioRol)
      .values(usuarioRoles)
      .execute()

    return usuarioResult
  }

  async actualizar(
    idUsuario: string,
    usuarioDto: Partial<ActualizarUsuarioDto>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction
      ? transaction.getRepository(Usuario)
      : this.dataSource.getRepository(Usuario)

    const datosActualizar: QueryDeepPartialEntity<Usuario> = new Usuario({
      estado: usuarioDto.estado || undefined,
      correoElectronico: usuarioDto.correoElectronico || undefined,
      contrasena: usuarioDto.contrasena || undefined,
      intentos: usuarioDto.intentos || undefined,
      fechaBloqueo: usuarioDto.fechaBloqueo
        ? dayjs(usuarioDto.fechaBloqueo).toDate()
        : undefined,
      codigoDesbloqueo: usuarioDto.codigoDesbloqueo,
      usuarioModificacion: usuarioAuditoria,
    })
    return await repo.update(idUsuario, datosActualizar)
  }

  async crearConPersonaExistente(usuarioDto, usuarioAuditoria: string) {
    const usuarioRoles: UsuarioRol[] = usuarioDto.roles.map((rol) => {
      const usuarioRol = new UsuarioRol()
      usuarioRol.rol = rol
      usuarioRol.usuarioCreacion = usuarioAuditoria

      return usuarioRol
    })

    // Usuario
    const usuario = new Usuario()
    usuario.usuarioRol = usuarioRoles

    // Persona
    usuario.persona = usuarioDto.persona

    usuario.usuario = usuarioDto.usuario
    usuario.estado = usuarioDto?.estado ?? Status.CREATE
    usuario.correoElectronico = usuarioDto?.correoElectronico
    usuario.contrasena =
      usuarioDto?.contrasena ??
      (await TextService.encrypt(TextService.generateUuid()))
    usuario.ciudadaniaDigital = usuarioDto?.ciudadaniaDigital ?? false
    usuario.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async actualizarContadorBloqueos(idUsuario: string, intento: number) {
    return await this.dataSource
      .createQueryBuilder()
      .update(Usuario)
      .set({
        intentos: intento,
      })
      .where({ id: idUsuario })
      .execute()
  }

  async actualizarDatosBloqueo(
    idUsuario: string,
    codigo: string,
    fechaBloqueo: Date
  ) {
    const datosActualizar: QueryDeepPartialEntity<Usuario> = new Usuario({
      codigoDesbloqueo: codigo,
      fechaBloqueo: fechaBloqueo,
    })
    return await this.dataSource
      .createQueryBuilder()
      .update(Usuario)
      .set(datosActualizar)
      .where({ id: idUsuario })
      .execute()
  }

  async actualizarDatosRecuperacion(idUsuario: string, codigo: string) {
    const datosActualizar: QueryDeepPartialEntity<Usuario> = new Usuario({
      codigoRecuperacion: codigo,
    })
    return await this.dataSource
      .createQueryBuilder()
      .update(Usuario)
      .set(datosActualizar)
      .where({ id: idUsuario })
      .execute()
  }

  async actualizarDatosActivacion(
    idUsuario: string,
    codigo: string,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    const datosActualizar: QueryDeepPartialEntity<Usuario> = new Usuario({
      codigoActivacion: codigo,
      usuarioModificacion: usuarioAuditoria,
    })
    return await transaction
      .createQueryBuilder()
      .update(Usuario)
      .set(datosActualizar)
      .where({ id: idUsuario })
      .execute()
  }

  async actualizarDatosTransaccion(idUsuario: string, codigo: string) {
    return await this.dataSource
      .createQueryBuilder()
      .update(Usuario)
      .set({
        codigoTransaccion: codigo,
      })
      .where({ id: idUsuario })
      .execute()
  }

  async buscarPorCodigoDesbloqueo(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoDesbloqueo = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoRecuperacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoRecuperacion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoTransaccion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoTransaccion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoActivacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoActivacion = :codigo', { codigo })
      .getOne()
  }

  async actualizarDatosPersona({ persona }: ActualizarUsuarioRolDto) {
    const datosActualizar: QueryDeepPartialEntity<Persona> = new Persona({
      ...persona,
    })
    return await this.dataSource
      .createQueryBuilder()
      .update(Persona)
      .set(datosActualizar)
      .where('nroDocumento = :nroDocumento', {
        nroDocumento: persona?.nroDocumento,
      })
      .orWhere('correoElectronicoPersonal = :correoElectronicoPersonal', {
        correoElectronicoPersonal: persona?.correoElectronicoPersonal,
      })
      .execute()
  }

  async actualizarUsuario(
    id: string,
    usuario: Partial<Usuario>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction
      ? transaction.getRepository(Usuario)
      : this.dataSource.getRepository(Usuario)

    const datosActualizar: QueryDeepPartialEntity<Usuario> = new Usuario({
      ...usuario,
      usuarioModificacion: usuarioAuditoria,
    })
    return await repo
      .createQueryBuilder()
      .update(Usuario)
      .set(datosActualizar)
      .where({ id: id })
      .execute()
  }

  protected buscarUsuarioEnAsignacionDePuestos(
    idUsuario: string,
    transaction: EntityManager
  ) {
    return transaction
      .getRepository(UsuarioAsignacionPuesto)
      .createQueryBuilder('usuarioAsignacionPuesto')
      .where('usuarioAsignacionPuesto.idUsuario = :id', { id: idUsuario })
      .getMany()
  }

  protected async actualizarUsuarioAsignacionDePuestos(
    idAsignaciondePuestos: Set<string> | undefined,
    idUsuario: string,
    transaction: EntityManager
  ) {
    if (!idAsignaciondePuestos) return
    const usuarioAsignacionPuestos =
      await this.buscarUsuarioEnAsignacionDePuestos(idUsuario, transaction)
    const usuarioAsingacionDePuestoIds = usuarioAsignacionPuestos.map(
      (usuarioAD) => usuarioAD.idAsignacionPuesto
    )

    const setIdDto = new Set(idAsignaciondePuestos)

    const setIds = new Set(usuarioAsingacionDePuestoIds)
    const existenIdsEnIdUsuarioAsignacionPuesto =
      usuarioAsingacionDePuestoIds.every((id) => setIdDto.has(id))

    if (!existenIdsEnIdUsuarioAsignacionPuesto) {
      throw new BadRequestException(
        UnidadOrganizacionalMessages.NOT_FOUND_USUARIO_ASIGNACION_DE_PUESTOS
      )
    }

    for (const id of idAsignaciondePuestos) {
      const asignacionDePuesto = await this.buscarAsingacionDePuestoPorId(
        id,
        transaction
      )
      if (!setIds.has(id)) {
        await transaction.save(
          UsuarioAsignacionPuesto.create({
            asignacionDePuesto,
            idUsuario,
            usuarioCreacion: '1',
          })
        )
      }
    }
  }

  async actualizarUsuarioPersona(
    idUsuario: string,
    usuarioAuditoria: string,
    usuarioDto: ActualizarUsuarioRolDto
  ) {
    try {
      await this.dataSource.transaction(async (transaction: EntityManager) => {
        const { persona, ...usuarioData } = usuarioDto
        const usuario = await this.buscarPorId(idUsuario, transaction)
        if (persona && usuario) {
          await transaction
            .getRepository(Persona)
            .update(usuario.idPersona, persona)

          usuario.fechaAsignacionItem = usuarioData.fechaAsignacionItem
          usuario.profesion = usuarioData.profesion ? usuarioData.profesion : ''
          usuario.nroRegistroProfesional = usuarioData.nroRegistroProfesional
          usuario.nroFuncionarioCarrera = usuarioData.nroFuncionarioCarrera
          usuario.correoElectronico = usuarioData.correoElectronico
          usuario.usuarioModificacion = usuarioAuditoria
          await transaction.getRepository(Usuario).save(usuario)

          await this.actualizarUsuarioAsignacionDePuestos(
            usuarioDto.asignacionDePuestos,
            idUsuario,
            transaction
          )
        }
      })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }

  async listarUsuariosParaPermisos() {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoin('usuario.usuarioRol', 'usuarioRol')
      .leftJoin('usuarioRol.rol', 'rol')
      .leftJoin('usuario.persona', 'persona')
      .select([
        'usuario.usuario',
        'usuario.profesion',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.nroDocumento',
        'usuarioRol.id',
        'rol.rol',
        'rol.nombre',
      ])
      .where('usuario.estado = :estado', { estado: Status.ACTIVE })
      .orderBy('usuario.id', 'ASC')
      .getMany()
  }

  async listarEscalaSalarialConsultor() {
    return await this.dataSource
      .getRepository(EscalaSalarial)
      .createQueryBuilder('escalaSalarial')
      .select(['escalaSalarial.id', 'escalaSalarial.sueldo_haber_mensual'])
      .where('escalaSalarial.tipo = :tipo', { tipo: 'CONSULTORIA' })
      .getMany()
  }
}
