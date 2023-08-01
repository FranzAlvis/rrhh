import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'
import { AsignacionPuestosAprobado } from './asignacion-puestos-aprobado.entity'

dotenv.config()

export const UnidadOrganizacionalAprobadoEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(UnidadOrganizacionalAprobadoEstado))
@Entity({
  name: 'unidades_organizacionales_aprobados',
  schema: process.env.DB_SCHEMA_RRHH,
})
@Tree('materialized-path')
export class UnidadOrganizacionalAprobado extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar' })
  nombre: string

  @Column({ type: 'integer' })
  nivel: number

  @Column({ type: 'varchar' })
  sigla: string

  @Column({
    name: 'id_dependencia',
    type: 'bigint',
    nullable: true,
  })
  idDependencia?: string | null

  constructor(data?: Partial<UnidadOrganizacionalAprobado>) {
    super(data)
  }

  @TreeChildren()
  children: UnidadOrganizacionalAprobado

  @TreeParent({ onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_dependencia', referencedColumnName: 'id' })
  dependencia: UnidadOrganizacionalAprobado | null

  @OneToMany(
    () => AsignacionPuestosAprobado,
    (asignacionPuestosAprobado) =>
      asignacionPuestosAprobado.unidadOrganizacionalAprobado,
    { nullable: true, cascade: true }
  )
  asignacionesPuestosAprobado: AsignacionPuestosAprobado[] | null

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UnidadOrganizacionalAprobadoEstado.ACTIVE
  }
}
