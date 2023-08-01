import { Transform } from 'class-transformer'
import { IsIn } from 'class-validator'
import { Genero } from '../../../common/constants'
import {
  IsEmail,
  CorreoLista,
  IsNotEmpty,
  IsString,
  NombreApellido,
  NroDocumento,
  IsDateString,
  ValidateIf,
  IsUppercase,
  MinLength,
  IsOptional,
  MaxLength,
} from '../../../common/validation'

export class PersonaDto {
  @IsNotEmpty()
  @NroDocumento()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  nroDocumento: string

  tipoDocumento?: string

  @IsNotEmpty()
  @NombreApellido()
  @IsUppercase()
  nombres: string

  @IsString()
  @ValidateIf((o) => !o.segundoApellido)
  @NombreApellido()
  @IsUppercase()
  primerApellido?: string

  @ValidateIf((o) => !o.primerApellido)
  @NombreApellido()
  @IsUppercase()
  segundoApellido?: string

  @IsDateString()
  fechaNacimiento?: Date | null

  @MinLength(8)
  telefono?: string

  @IsString()
  @MinLength(4)
  @MaxLength(24)
  @ValidateIf((o) => o.genero === Genero.MASCULINO)
  @IsOptional()
  nroLibretaServicioMilitar?: string

  @IsNotEmpty()
  @IsString()
  @IsIn([`${Genero.MASCULINO}`, `${Genero.FEMENINO}`, `${Genero.OTRO}`])
  genero?: string

  @IsEmail()
  @CorreoLista()
  @IsNotEmpty()
  correoElectronicoPersonal: string
}
