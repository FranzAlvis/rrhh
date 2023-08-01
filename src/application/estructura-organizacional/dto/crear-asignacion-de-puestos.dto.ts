import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
export class CrearAsignacionDePuestosDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  descripcion_puesto: string

  @IsOptional()
  @IsNumber()
  nro_item: number

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
