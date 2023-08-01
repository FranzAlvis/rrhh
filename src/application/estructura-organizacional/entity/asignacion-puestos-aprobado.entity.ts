import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'
import { UnidadOrganizacionalAprobado } from './unidad-organizacional-aprobado.entity'
import { EscalaSalarialAprobado } from './escala-salarial-aprobado.entity'
import { Organigrama } from './organigrama.entity'

dotenv.config()

export const AsignacionPuestosAprobadoEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(AsignacionPuestosAprobadoEstado))
@Entity({
  name: 'asignacion_puestos_aprobados',
  schema: process.env.DB_SCHEMA_RRHH,
})
export class AsignacionPuestosAprobado extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 255, type: 'varchar' })
  descripcion_puesto: string

  @Column({ width: 100, type: 'integer' })
  nro_item: number

  @Column({ width: 100, type: 'integer' })
  nivel: number

  @Column({ width: 100, type: 'integer' })
  cargo: number

  @Column({
    name: 'id_unidades_organizacionales',
    type: 'bigint',
    nullable: true,
  })
  idUnidadOrganizacional: number | null

  @Column({
    name: 'id_escala_salarial',
    type: 'bigint',
    nullable: true,
  })
  idEscalaSalarial: number | null

  @Column({
    name: 'id_organigrama',
    type: 'bigint',
    nullable: true,
  })
  idOrganigrama: number | null

  constructor(data?: Partial<AsignacionPuestosAprobado>) {
    super(data)
  }

  @ManyToOne(
    () => UnidadOrganizacionalAprobado,
    (asignacionPuestosAprobado) =>
      asignacionPuestosAprobado.asignacionesPuestosAprobado,
    { nullable: true, onDelete: 'SET NULL' }
  )
  @JoinColumn({
    name: 'id_unidades_organizacionales',
    referencedColumnName: 'id',
  })
  unidadOrganizacionalAprobado: UnidadOrganizacionalAprobado | null

  @ManyToOne(
    () => EscalaSalarialAprobado,
    (escalaSalarialAprobado) =>
      escalaSalarialAprobado.asignacionesPuestosAprobado,
    { nullable: true, onDelete: 'SET NULL' }
  )
  @JoinColumn({
    name: 'id_escala_salarial',
    referencedColumnName: 'id',
  })
  escalaSalarialAprobado: EscalaSalarialAprobado | null

  @ManyToOne(
    () => Organigrama,
    (organigrama) => organigrama.asignacionesPuestosAprobado,
    { nullable: true, onDelete: 'SET NULL' }
  )
  @JoinColumn({
    name: 'id_organigrama',
    referencedColumnName: 'id',
  })
  organigrama: Organigrama | null

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || AsignacionPuestosAprobadoEstado.ACTIVE
  }
}
