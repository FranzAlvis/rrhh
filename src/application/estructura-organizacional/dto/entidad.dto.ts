import { IsNotEmpty, IsString } from '../../../common/validation'

export class EntidadDto {
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
