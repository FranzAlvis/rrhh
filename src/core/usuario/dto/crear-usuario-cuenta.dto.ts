import { NombreUsuario } from 'src/common/validation/nombre-usuario'
import {
  CorreoLista,
  IsEmail,
  IsNotEmpty,
  IsString,
} from '../../../common/validation'

export class CrearUsuarioCuentaDto {
  @IsNotEmpty()
  @IsString()
  @NombreUsuario()
  nombres: string

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string
}
