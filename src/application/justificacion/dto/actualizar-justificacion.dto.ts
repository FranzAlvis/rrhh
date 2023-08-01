import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'src/common/validation'

export class ActualizarJustificacionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descripcion: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  idTipoPermiso: string

  @ApiProperty({ description: 'id del estado' })
  estado?: string
}
