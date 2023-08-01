import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'
import { UnidadOrganizacional } from './unidad-organizacional.entity'
import { Organigrama } from './organigrama.entity'
import { EscalaSalarial } from './escala-salarial.entity'
import { UsuarioAsignacionPuesto } from './usuario-asignacion-puesto.entity'

dotenv.config()

export const AsignacionDePuestosEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(AsignacionDePuestosEstado))
@Entity({
  name: 'asignacion_puestos',
  schema: process.env.DB_SCHEMA_RRHH,
})
export class AsignacionDePuestos extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 255, type: 'varchar' })
  descripcion_puesto: string

  @Column({ width: 100, type: 'integer', unique: true })
  nro_item: number

  @Column({ width: 100, type: 'integer' })
  nivel: number

  @Column({ width: 100, type: 'integer' })
  cargo: number

  @Column({
    name: 'id_unidades_organizacionales',
    type: 'bigint',
  })
  idUnidadOrganizacional: number

  @Column({
    name: 'id_escala_salarial',
    type: 'bigint',
  })
  idEscalaSalarial: number

  @Column({
    name: 'id_organigrama',
    type: 'bigint',
  })
  idOrganigrama: number

  constructor(data?: Partial<AsignacionDePuestos>) {
    super(data)
  }

  @ManyToOne(
    () => UnidadOrganizacional,
    (unidadOrganizacional) => unidadOrganizacional.asignacionesDePuestos
  )
  @JoinColumn({
    name: 'id_unidades_organizacionales',
    referencedColumnName: 'id',
  })
  unidadOrganizacional: UnidadOrganizacional

  @ManyToOne(
    () => EscalaSalarial,
    (escalaSalarial) => escalaSalarial.asignacionesDePuestos
  )
  @JoinColumn({
    name: 'id_escala_salarial',
    referencedColumnName: 'id',
  })
  escalaSalarial: EscalaSalarial

  @ManyToOne(
    () => Organigrama,
    (organigrama) => organigrama.asignacionesDePuestos,
    { onDelete: 'SET NULL' }
  )
  @JoinColumn({
    name: 'id_organigrama',
    referencedColumnName: 'id',
  })
  organigrama: Organigrama

  @OneToMany(
    () => UsuarioAsignacionPuesto,
    (usuarioAsignacionPuesto) => usuarioAsignacionPuesto.asignacionDePuesto
  )
  usuarioAsignacionPuesto?: UsuarioAsignacionPuesto[]

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || AsignacionDePuestosEstado.ACTIVE
  }
}
