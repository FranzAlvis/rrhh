import { ApiProperty } from '@nestjs/swagger'
import { AuditoriaEntity } from 'src/common/entity/auditoria.entity'
import dotenv from 'dotenv'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Status } from 'src/common/constants'
import { UtilService } from 'src/common/lib/util.service'
import { Justificacion } from 'src/application/justificacion/entities/justificacion.entity'
import { TipoPermiso } from 'src/application/tipo_permiso/entities/tipo_permiso.entity'

dotenv.config()

export const PermisoEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(PermisoEstado))
@Entity({ name: 'permiso', schema: process.env.DB_SCHEMA })
export class Permiso extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @ApiProperty({ description: 'Motivo de la solicitud de permiso' })
  @Column({
    name: 'motivo',
    length: 255,
    type: 'varchar',
    nullable: true,
  })
  motivo: string

  @ApiProperty({ description: 'Lugar de la solicitud de permiso' })
  @Column({
    name: 'lugar',
    length: 255,
    type: 'varchar',
    nullable: true,
  })
  lugar: string

  @ApiProperty({ description: 'Fecha de inicio de la solicitud de permiso' })
  @Column({
    name: 'fecha_inicio',
    type: 'date',
  })
  fechaInicio: Date

  @ApiProperty({ description: 'Hora de inicio de la solicitud de permiso' })
  @Column({
    name: 'hora_inicio',
    length: 5,
    type: 'varchar',
    nullable: true,
  })
  horaInicio: string

  @ApiProperty({ description: 'Fecha de fin de la solicitud de permiso' })
  @Column({
    name: 'fecha_fin',
    type: 'date',
  })
  fechaFin: Date

  @ApiProperty({ description: 'Hora de fin de la solicitud de permiso' })
  @Column({
    name: 'hora_fin',
    length: 5,
    type: 'varchar',
    nullable: true,
  })
  horaFin: string

  @ApiProperty({ description: 'Solicitante para permiso' })
  @Column({
    name: 'id_usuario_solicitante',
    length: 50,
    type: 'varchar',
  })
  idUsuarioSolicitante: string

  @ApiProperty({ description: 'Via para permiso' })
  @Column({
    name: 'id_usuario_via',
    length: 50,
    type: 'varchar',
    nullable: true,
  })
  idUsuarioVia: string

  @ApiProperty({ description: 'Receptor para permiso' })
  @Column({
    name: 'id_usuario_receptor',
    length: 50,
    type: 'varchar',
  })
  idUsuarioReceptor: string

  @ApiProperty({ description: 'Justificación para permiso' })
  @Column({
    name: 'id_justificacion',
    type: 'bigint',
  })
  idJustificacion: string

  @ApiProperty({ description: 'Tipo de permiso' })
  @Column({
    name: 'id_tipo_permiso',
    type: 'bigint',
  })
  idTipoPermiso: string

  @ManyToOne(() => Justificacion, (justificacion) => justificacion.permisos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_justificacion',
    referencedColumnName: 'id',
  })
  justificacion: Justificacion

  @ManyToOne(() => TipoPermiso, (tipoPermiso) => tipoPermiso.permisos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_tipo_permiso',
    referencedColumnName: 'id',
  })
  tipoPermiso: TipoPermiso

  constructor(data?: Partial<Permiso>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || PermisoEstado.ACTIVE
  }
}
