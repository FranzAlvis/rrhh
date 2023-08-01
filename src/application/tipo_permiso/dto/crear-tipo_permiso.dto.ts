import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'src/common/validation'

export class CrearTipoPermisoDto {
  @ApiProperty({ description: 'Sigla del tipo de permiso' })
  @IsNotEmpty()
  @IsString()
  sigla: string

  @ApiProperty({ description: 'Nombre del tipo de permiso' })
  @IsNotEmpty()
  @IsString()
  nombre: string

  @ApiProperty({ description: 'Descripción del tipo de permiso' })
  @IsNotEmpty()
  @IsString()
  descripcion: string

  @ApiProperty({ description: 'id del estado' })
  estado?: string
}
