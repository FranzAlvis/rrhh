import { IsDateString, IsNotEmpty } from 'src/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearPermisoDto {
  @ApiProperty({ description: 'motivo de la entidad permiso' })
  motivo: string

  @ApiProperty({ description: 'lugar de la entidad permiso' })
  lugar: string

  @ApiProperty({ description: 'fecha de inicio de la entidad permiso' })
  @IsNotEmpty()
  @IsDateString()
  fechaInicio: Date

  @ApiProperty({ description: 'hora de inicio de la entidad permiso' })
  horaInicio: string

  @ApiProperty({ description: 'fecha de fin de la entidad permiso' })
  @IsNotEmpty()
  @IsDateString()
  fechaFin: Date

  @ApiProperty({ description: 'hora de fin de la entidad permiso' })
  horaFin: string

  @ApiProperty({ description: 'id del usuario via' })
  idUsuarioVia: string

  @ApiProperty({ description: 'id del usuario receptor' })
  idUsuarioReceptor: string

  @ApiProperty({ description: 'id del usuario solicitante' })
  idUsuarioSolicitante: string

  @ApiProperty({
    description: 'ID de la justificación asociada a la solicitud de permiso',
  })
  idJustificacion: string

  @ApiProperty({
    description: 'ID del tipo de permiso de la solicitud de permiso',
  })
  idTipoPermiso: string

  @ApiProperty({ description: 'id del estado' })
  estado?: string
}
