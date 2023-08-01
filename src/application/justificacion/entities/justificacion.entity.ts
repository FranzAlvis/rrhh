import { ApiProperty } from '@nestjs/swagger'
import { TipoPermiso } from 'src/application/tipo_permiso/entities/tipo_permiso.entity'
import { AuditoriaEntity } from 'src/common/entity/auditoria.entity'
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
import { Status } from 'src/common/constants'
import { UtilService } from 'src/common/lib/util.service'
import { Permiso } from 'src/application/permiso/entities/permiso.entity'

dotenv.config()

export const JustificacionEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(JustificacionEstado))
@Entity({ name: 'justificacion', schema: process.env.DB_SCHEMA })
export class Justificacion extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @ApiProperty({ description: 'Nombre de la justificacion' })
  @Column({
    name: 'nombre',
    length: 255,
    type: 'varchar',
  })
  nombre: string

  @ApiProperty({ description: 'Descripcion de la justificacion' })
  @Column({
    name: 'descripcion',
    length: 255,
    type: 'varchar',
    nullable: true,
  })
  descripcion: string

  @ApiProperty({ description: 'Id de tipo permiso' })
  @Column({
    name: 'id_tipo_permiso',
    type: 'bigint',
    nullable: false,
  })
  idTipoPermiso: string

  @ApiProperty({ description: 'Relacion con tipo permiso' })
  @ManyToOne(() => TipoPermiso, (tipoPermiso) => tipoPermiso.justificaciones, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_tipo_permiso',
    referencedColumnName: 'id',
  })
  tipoPermiso: TipoPermiso

  @ApiProperty({ description: 'Relacion con permiso' })
  @OneToMany(() => Permiso, (permiso) => permiso.idJustificacion)
  permisos: Permiso[]

  constructor(data?: Partial<Justificacion>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || JustificacionEstado.ACTIVE
  }
}
