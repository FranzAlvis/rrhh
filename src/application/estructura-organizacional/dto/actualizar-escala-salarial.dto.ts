import { Parametro } from 'src/application/parametro/parametro.entity'
import { IsNotEmpty, IsNumber, IsString } from '../../../common/validation'

export class ActualizarEscalaSalarialDto {
  @IsNotEmpty()
  @IsNumber()
  nivel_salarial: number
  @IsNotEmpty()
  @IsString()
  denominacion_puesto: string
  @IsNotEmpty()
  @IsNumber()
  sueldo_haber_mensual: number
  @IsNotEmpty()
  tipo: Parametro
}
