import { AuditoriaEntity } from 'src/common/entity/auditoria.entity'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { Status } from 'src/common/constants'
import { UtilService } from 'src/common/lib/util.service'
import { AsignacionPuestosAprobado } from './asignacion-puestos-aprobado.entity'

dotenv.config()

export const EscalaSalarialAprobadoEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(EscalaSalarialAprobadoEstado))
@Entity({
  name: 'escalas_salariales_aprobados',
  schema: process.env.DB_SCHEMA_RRHH,
})
export class EscalaSalarialAprobado extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ width: 10, type: 'integer' })
  nivel_salarial: number

  @Column({ length: 255, type: 'varchar' })
  denominacion_puesto: string

  @Column({ precision: 19, scale: 2, type: 'decimal' })
  sueldo_haber_mensual: number

  @OneToMany(
    () => AsignacionPuestosAprobado,
    (asignacionPuestosAprobado) =>
      asignacionPuestosAprobado.escalaSalarialAprobado,
    { nullable: true, cascade: true }
  )
  asignacionesPuestosAprobado: AsignacionPuestosAprobado[] | null

  constructor(data?: Partial<EscalaSalarialAprobado>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || EscalaSalarialAprobadoEstado.ACTIVE
  }
}
