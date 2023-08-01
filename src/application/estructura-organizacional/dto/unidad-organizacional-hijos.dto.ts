import { IsNotEmpty, IsUppercase, IsDefined } from '../../../common/validation'
export class UnidadOrganizacionalHijosDto {
  @IsNotEmpty()
  @IsDefined()
  @IsUppercase()
  nombre: string

  @IsNotEmpty()
  @IsDefined()
  nivel: number

  @IsNotEmpty()
  @IsUppercase()
  @IsDefined()
  sigla: string
  estado?: string
}
