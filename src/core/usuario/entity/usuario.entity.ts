import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity'
import { Persona } from './persona.entity'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'
import { UsuarioAsignacionPuesto } from 'src/application/estructura-organizacional/entity/usuario-asignacion-puesto.entity'

dotenv.config()

export const UsuarioEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
  CREATE: Status.CREATE,
  PENDING: Status.PENDING,
}

@Check(UtilService.buildStatusCheck(UsuarioEstado))
@Entity({ name: 'usuarios', schema: process.env.DB_SCHEMA_USUARIOS })
export class Usuario extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ name: 'nombre_usuario', length: 50, type: 'varchar', unique: true })
  usuario: string

  @Column({ length: 255, type: 'varchar' })
  contrasena: string

  @Column({ name: 'ciudadania_digital', type: 'boolean', default: false })
  ciudadaniaDigital: boolean

  @Column({ name: 'fecha_asignacion_item', type: 'date', nullable: true })
  fechaAsignacionItem?: Date | null

  @Column({
    name: 'correo_electronico_institucional',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  correoElectronico?: string | null

  @Column({ length: 255, type: 'varchar' })
  profesion: string

  @Column({
    name: 'nro_registro_profesional',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  nroRegistroProfesional?: string

  @Column({
    name: 'nro_funcionario_carrera',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  nroFuncionarioCarrera?: string

  @Column({
    type: 'integer',
    default: 0,
  })
  intentos: number

  @Index()
  @Column({
    name: 'codigo_desbloqueo',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoDesbloqueo?: string | null

  @Index()
  @Column({
    name: 'codigo_recuperacion',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoRecuperacion?: string | null

  @Index()
  @Column({
    name: 'codigo_transaccion',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoTransaccion?: string | null

  @Index()
  @Column({
    name: 'codigo_activacion',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoActivacion?: string | null

  @Column({
    name: 'fecha_bloqueo',
    type: 'timestamp without time zone',
    nullable: true,
  })
  fechaBloqueo?: Date | null

  @Column({
    name: 'id_persona',
    type: 'bigint',
    nullable: false,
  })
  idPersona: string

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  usuarioRol: UsuarioRol[]

  @ManyToOne(() => Persona, (persona) => persona.usuarios, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona

  @Column({
    name: 'id_unidad_organizacional',
    type: 'bigint',
    nullable: true,
  })
  idUnidadOrganizacional?: string

  @OneToMany(
    () => UsuarioAsignacionPuesto,
    (usuarioAsignacionPuesto) => usuarioAsignacionPuesto.usuario
  )
  usuarioAsignacionPuestos?: UsuarioAsignacionPuesto[]

  constructor(data?: Partial<Usuario>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UsuarioEstado.ACTIVE
  }
}
