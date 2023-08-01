import { IsNotEmpty, IsNumber, IsString } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearOrganigramaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  version: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  gestion: number
}
