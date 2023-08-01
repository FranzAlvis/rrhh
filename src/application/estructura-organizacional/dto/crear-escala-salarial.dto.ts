import { IsString, IsUppercase } from '../../../common/validation'
import { IsNotEmpty, IsNumber } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'
import { Parametro } from 'src/application/parametro/parametro.entity'
export class CrearEscalaSalarialDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nivel_salarial: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  denominacion_puesto: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sueldo_haber_mensual: number

  @ApiProperty()
  @IsNotEmpty()
  tipo: Parametro
}
