import { IsNotEmpty, IsUppercase, IsDefined } from '../../../common/validation'
export class UnidadOrganizacionalDependenciaDto {
  @IsNotEmpty()
  @IsDefined()
  id!: string

  @IsNotEmpty()
  @IsUppercase()
  nombre: string

  @IsNotEmpty()
  nivel: number

  @IsNotEmpty()
  sigla: string
  estado?: string
}
