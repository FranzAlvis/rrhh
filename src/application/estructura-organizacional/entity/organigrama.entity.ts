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
import { EstadosOrganigramas } from 'src/common/constants'
import { AsignacionDePuestos } from './asignacion-de-puestos.entity'
import { UtilService } from 'src/common/lib/util.service'
import { AsignacionPuestosAprobado } from './asignacion-puestos-aprobado.entity'

dotenv.config()

export const OrganigramaEstado = {
  ...EstadosOrganigramas,
}

@Check(UtilService.buildStatusCheck(OrganigramaEstado))
@Entity({
  name: 'organigrama',
  schema: process.env.DB_SCHEMA_RRHH,
})
export class Organigrama extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 10, type: 'varchar' })
  version: string

  @Column({ width: 10, type: 'integer' })
  gestion: number

  constructor(data?: Partial<Organigrama>) {
    super(data)
  }

  @OneToMany(
    () => AsignacionDePuestos,
    (asignacionDePuestos) => asignacionDePuestos.organigrama,
    { nullable: true, cascade: true }
  )
  asignacionesDePuestos: AsignacionDePuestos[] | null

  @OneToMany(
    () => AsignacionPuestosAprobado,
    (asignacionPuestosAprobado) => asignacionPuestosAprobado.organigrama,
    { nullable: true, cascade: true, onDelete: 'SET NULL' }
  )
  asignacionesPuestosAprobado: AsignacionPuestosAprobado[] | null

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || OrganigramaEstado.ELABORACION
  }
}
