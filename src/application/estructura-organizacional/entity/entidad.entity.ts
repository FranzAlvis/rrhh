import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { UtilService } from 'src/common/lib/util.service'
import { Status } from 'src/common/constants'
import { AuditoriaEntity } from 'src/common/entity/auditoria.entity'

dotenv.config()

export const EntidadEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(EntidadEstado))
@Entity({
  name: 'entidades',
  schema: process.env.DB_SCHEMA_RRHH,
})
export class Entidad extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 150, type: 'varchar' })
  nombre: string

  @Column({ length: 150, type: 'varchar' })
  fuente: string

  @Column({ length: 150, type: 'varchar' })
  organismo: string

  constructor(data?: Partial<Entidad>) {
    super(data)
  }

  @BeforeInsert()
  insertartEstado() {
    this.estado = this.estado || EntidadEstado.ACTIVE
  }
}
