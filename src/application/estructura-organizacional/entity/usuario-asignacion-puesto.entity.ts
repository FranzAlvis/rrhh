import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Status } from '../../../common/constants'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { UtilService } from '../../../common/lib/util.service'
import { AsignacionDePuestos } from 'src/application/estructura-organizacional/entity/asignacion-de-puestos.entity'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'

dotenv.config()

export const UsuarioAsignacionPuestoEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(UsuarioAsignacionPuestoEstado))
@Entity({
  name: 'usuarios_asignacion_puestos',
  schema: process.env.DB_SCHEMA_RRHH,
})
export class UsuarioAsignacionPuesto extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({
    name: 'id_asignacion_puesto',
    type: 'bigint',
    nullable: false,
  })
  idAsignacionPuesto: string

  @Column({
    name: 'id_usuario',
    type: 'bigint',
    nullable: false,
  })
  idUsuario: string

  @ManyToOne(
    () => AsignacionDePuestos,
    (asignacionDePuestos) => asignacionDePuestos.usuarioAsignacionPuesto,
    { onDelete: 'SET NULL' }
  )
  @JoinColumn({ name: 'id_asignacion_puesto', referencedColumnName: 'id' })
  asignacionDePuesto: AsignacionDePuestos

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioAsignacionPuestos)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario

  constructor(data?: Partial<UsuarioAsignacionPuesto>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UsuarioAsignacionPuestoEstado.ACTIVE
  }
}
