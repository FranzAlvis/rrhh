import { IsNotEmpty, IsString } from '../../../common/validation'

export class ActualizarEntidadDto {
  @IsNotEmpty()
  @IsString()
  nombre: string
  @IsNotEmpty()
  @IsString()
  fuente: string
  @IsNotEmpty()
  @IsString()
  organismo: string
}
