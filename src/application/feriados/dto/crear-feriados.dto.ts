import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString } from 'src/common/validation'

export class CrearFeriadoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fecha: Date
}
