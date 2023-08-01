import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsDate } from 'src/common/validation'
import { Type } from 'class-transformer'

export class ActualizarFeriadoDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  nombre: string

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha: Date
}
