import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsString,
  IsNumber,
  IsUppercase,
  IsDefined,
} from '../../../common/validation'
import { Type } from 'class-transformer'
import { UnidadOrganizacionalHijosDto } from './unidad-organizacional-hijos.dto'
import { UnidadOrganizacionalDependenciaDto } from './unidad-organizacional-depedencia.dto'
export class CrearUnidadOrganizacionalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsUppercase()
  nombre: string

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  nivel: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsUppercase()
  sigla: string
  estado?: string

  @ApiProperty()
  @IsOptional()
  @Type(() => UnidadOrganizacionalDependenciaDto)
  dependencia?: UnidadOrganizacionalDependenciaDto | null

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnidadOrganizacionalHijosDto)
  hijos?: UnidadOrganizacionalHijosDto[]
}
