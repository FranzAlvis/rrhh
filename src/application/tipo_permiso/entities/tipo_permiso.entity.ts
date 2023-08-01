import { ApiProperty } from '@nestjs/swagger'
import { Justificacion } from 'src/application/justificacion/entities/justificacion.entity'
import { AuditoriaEntity } from 'src/common/entity/auditoria.entity'
import dotenv from 'dotenv'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Status } from 'src/common/constants'
import { UtilService } from 'src/common/lib/util.service'
import { Permiso } from 'src/application/permiso/entities/permiso.entity'

dotenv.config()

export const TipoPermisoEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(TipoPermisoEstado))
@Entity({ name: 'tipo_permiso', schema: process.env.DB_SCHEMA })
export class TipoPermiso extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @ApiProperty({ description: 'Sigla de tipo permiso' })
  @Column({
    name: 'sigla',
    length: 30,
    type: 'varchar',
  })
  sigla: string

  @ApiProperty({ description: 'Nombre del tipo de permiso' })
  @Column({
    name: 'nombre',
    length: 255,
    type: 'varchar',
  })
  nombre: string

  @ApiProperty({ description: 'Descripción del tipo de permiso' })
  @Column({
    name: 'descripcion',
    length: 255,
    type: 'varchar',
  })
  descripcion: string

  @ApiProperty({ description: 'Relacion con justificacion' })
  @OneToMany(() => Justificacion, (justificacion) => justificacion.tipoPermiso)
  justificaciones: Justificacion[]

  @ApiProperty({ description: 'Relacion con permiso' })
  @OneToMany(() => Permiso, (permiso) => permiso.idTipoPermiso)
  permisos: Permiso[]

  constructor(data?: Partial<TipoPermiso>) {
    super(data)
  }

  @ApiProperty({ description: 'Estado del tipo de permiso' })
  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || TipoPermisoEstado.ACTIVE
  }
}
