import { IsNotEmpty, IsString, Length } from '../../../common/validation'

export class ParamGrupoDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 15)
  grupo: string
}
