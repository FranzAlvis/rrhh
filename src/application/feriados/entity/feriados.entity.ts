import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'

export const FeriadosEstado = {
  ACTIVE: Status.ACTIVE,
}

@Check(UtilService.buildStatusCheck(FeriadosEstado))
@Entity({ name: 'feriados', schema: process.env.DB_SCHEMA })
export class Feriados extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 100, type: 'varchar', unique: true })
  nombre: string

  @Column({ type: 'date' })
  fecha: Date
  usuarioAuditoria: any

  constructor(data?: Partial<Feriados>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || FeriadosEstado.ACTIVE
  }
}
