import { Type } from 'class-transformer'
import {
  ArrayUnique,
  CorreoLista,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  NroFuncionarioCarrera,
  NroRegistroProfesional,
  ValidateIf,
  ValidateNested,
} from '../../../common/validation'
import { PersonaDto } from './persona.dto'

export class ActualizarUsuarioRolDto {
  @ValidateNested()
  @Type(() => PersonaDto)
  persona?: PersonaDto

  @IsDateString()
  @IsOptional()
  fechaAsignacionItem?: Date

  @IsNotEmpty()
  @IsOptional()
  profesion?: string

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  @IsString()
  @IsOptional()
  @NroRegistroProfesional()
  nroRegistroProfesional?: string

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  @IsString()
  @IsOptional()
  @NroFuncionarioCarrera()
  nroFuncionarioCarrera?: string

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  @IsOptional()
  @ValidateIf((o) => !o.roles)
  correoElectronico?: string | null

  @IsNotEmpty()
  @IsArray()
  @ValidateIf((o) => !o.correoElectronico)
  roles: Array<string>

  @IsOptional()
  @ArrayUnique()
  asignacionDePuestos?: Set<string>
}
