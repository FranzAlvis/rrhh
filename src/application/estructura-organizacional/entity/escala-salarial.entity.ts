import { AuditoriaEntity } from 'src/common/entity/auditoria.entity'
import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { Status } from 'src/common/constants'
import { UtilService } from 'src/common/lib/util.service'
import { AsignacionDePuestos } from './asignacion-de-puestos.entity'
import { Parametro } from 'src/application/parametro/parametro.entity'

dotenv.config()

export const EnumEscalaSalarialEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(EnumEscalaSalarialEstado))
@Entity({
  name: 'escalas_salariales',
  schema: process.env.DB_SCHEMA_RRHH,
})
export class EscalaSalarial extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ width: 10, type: 'integer' })
  nivel_salarial: number

  @Column({ length: 255, type: 'varchar' })
  denominacion_puesto: string

  @Column({ precision: 19, scale: 2, type: 'decimal' })
  sueldo_haber_mensual: number

  @ManyToOne(() => Parametro, (parametro) => parametro.relaciones, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'tipo', referencedColumnName: 'codigo' })
  tipo: Parametro

  @OneToMany(
    () => AsignacionDePuestos,
    (asignacionDePuestos) => asignacionDePuestos.escalaSalarial,
    { nullable: true, onDelete: 'SET NULL', cascade: true }
  )
  asignacionesDePuestos: AsignacionDePuestos[] | null

  constructor(data?: Partial<EscalaSalarial>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || EnumEscalaSalarialEstado.ACTIVE
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateTipo() {
    if (!this.tipo || this.tipo.grupo !== 'ESCALA-SALARIAL') {
      throw new Error('El parámetro debe pertenecer al grupo "ESCALA-SALARIAL"')
    }
  }
}
