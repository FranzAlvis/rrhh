import { BaseController } from 'src/common/base/base-controller'
import { CrearEscalaSalarialDto } from '../dto/crear-escala-salarial.dto'
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { EscalaSalarialAprobadoService } from '../service/escala-salarial-aprobado.service'

@ApiTags('Escalas Salariales Aprobadas')
@Controller('escalas-salariales-aprobados')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class EscalaSalarialAprobadoController extends BaseController {
  constructor(
    private readonly escalaSalarialAprobadoService: EscalaSalarialAprobadoService
  ) {
    super()
  }

  // create item
  @Post()
  async crear(
    @Req() req,
    @Body() crearEscalaSalarialDto: CrearEscalaSalarialDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.escalaSalarialAprobadoService.crear(
      crearEscalaSalarialDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  //GET entidades - listar
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.escalaSalarialAprobadoService.listar(
      paginacionQueryDto
    )
    return this.successListRows(result)
  }
}
