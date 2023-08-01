import {
  IsEmail,
  IsNotEmpty,
  CorreoLista,
  ValidateNested,
  IsString,
  IsDateString,
  IsNumberString,
  IsOptional,
  NombreUsuario,
  NroFuncionarioCarrera,
  NroRegistroProfesional,
  MaxLength,
  MinLength,
  ArrayUnique,
} from '../../../common/validation'
import { PersonaDto } from './persona.dto'
import { Exclude, Transform, Type } from 'class-transformer'

export class CrearUsuarioDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @NombreUsuario()
  usuario: string

  estado?: string

  @Exclude()
  contrasena?: string

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto

  ciudadaniaDigital?: boolean = false

  @IsNotEmpty()
  @IsNumberString({}, { each: true })
  roles: Array<string>

  usuarioCreacion?: string

  @IsDateString()
  @IsOptional()
  fechaAsignacionItem?: Date

  @IsNotEmpty()
  profesion?: string

  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(16)
  @NroRegistroProfesional()
  nroRegistroProfesional?: string

  @IsString()
  @IsOptional()
  @NroFuncionarioCarrera()
  @MinLength(4)
  @MaxLength(16)
  nroFuncionarioCarrera?: string

  @IsOptional()
  @ArrayUnique()
  asignacionDePuestos?: Set<string>
}
