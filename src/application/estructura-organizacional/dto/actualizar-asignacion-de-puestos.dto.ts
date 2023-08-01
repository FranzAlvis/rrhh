import { IsNotEmpty, IsNumber, IsString } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
export class ActualizarAsignacionDePuestosDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  descripcion_puesto: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nivel: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cargo: number

  @ApiProperty()
  @IsNumber()
  idUnidadOrganizacional: number

  @ApiProperty()
  @IsNumber()
  idEscalaSalarial: number

  @ApiProperty()
  @IsNumber()
  idOrganigrama: number

  estado?: string
}
