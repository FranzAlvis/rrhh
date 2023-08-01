import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsUppercase,
  IsDefined,
} from '../../../common/validation'
import { Type } from 'class-transformer'
import { UnidadOrganizacionalDependenciaDto } from './unidad-organizacional-depedencia.dto'
import { UnidadOrganizacionalHijosDto } from './unidad-organizacional-hijos.dto'
export class ActualizarUnidadOrganizacionalDto {
  @IsNotEmpty()
  @IsUppercase()
  @IsDefined()
  nombre: string

  @IsDefined()
  @IsNotEmpty()
  nivel: number

  @IsNotEmpty()
  @IsUppercase()
  @IsDefined()
  sigla: string
  estado?: string

  @ApiProperty()
  @IsOptional()
  @Type(() => UnidadOrganizacionalDependenciaDto)
  @ValidateNested()
  dependencia?: UnidadOrganizacionalDependenciaDto

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnidadOrganizacionalHijosDto)
  hijos: UnidadOrganizacionalHijosDto[]
}
