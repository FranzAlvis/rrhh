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
import { AsignacionDePuestos } from './asignacion-de-puestos.entity'

dotenv.config()

export const UnidadOrganizacionalEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(UnidadOrganizacionalEstado))
@Entity({
  name: 'unidades_organizacionales',
  schema: process.env.DB_SCHEMA_RRHH,
})
@Tree('materialized-path')
export class UnidadOrganizacional extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 255, type: 'varchar', unique: true })
  nombre: string

  @Column({ type: 'integer' })
  nivel: number

  @Column({ type: 'varchar', unique: true })
  sigla: string

  @Column({
    name: 'id_dependencia',
    type: 'bigint',
    nullable: true,
  })
  idDependencia?: string | null

  constructor(data?: Partial<UnidadOrganizacional>) {
    super(data)
  }

  @TreeChildren({ cascade: true })
  hijos: UnidadOrganizacional[] | null

  @TreeParent({ onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_dependencia', referencedColumnName: 'id' })
  dependencia: UnidadOrganizacional | null

  @OneToMany(
    () => AsignacionDePuestos,
    (asignacionDePuestos) => asignacionDePuestos.unidadOrganizacional,
    { nullable: true, cascade: true }
  )
  asignacionesDePuestos: AsignacionDePuestos[] | null

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UnidadOrganizacionalEstado.ACTIVE
  }
}
