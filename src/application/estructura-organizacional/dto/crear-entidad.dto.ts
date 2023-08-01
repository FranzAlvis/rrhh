import { IsNotEmpty, IsString } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearEntidadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fuente: string
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organismo: string
  estado?: string
}
