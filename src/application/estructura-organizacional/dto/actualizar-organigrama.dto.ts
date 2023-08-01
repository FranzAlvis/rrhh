import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'
import { EstadosOrganigramas } from 'src/common/constants'

export class ActualizarOrganigramaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  version: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  gestion: number

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(EstadosOrganigramas)
  estado
}
