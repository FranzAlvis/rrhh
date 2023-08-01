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
import { CrearAsignacionDePuestosDto } from '../dto/crear-asignacion-de-puestos.dto'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base/base-controller'
import { AsignacionPuestosAprobadoService } from '../service/asignacion-puestos-aprobado.service'

@ApiTags('Asignación de Puestos Aprobados')
@Controller('asignacion-puestos-aprobados')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class AsignacionPuestosAprobadoController extends BaseController {
  constructor(
    private asignacionPuestosAprobadoServicio: AsignacionPuestosAprobadoService
  ) {
    super()
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.asignacionPuestosAprobadoServicio.listar(
      paginacionQueryDto
    )
    return this.successListRows(result)
  }

  @Post()
  async crear(
    @Req() req,
    @Body() asignacionDePuestosDto: CrearAsignacionDePuestosDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.asignacionPuestosAprobadoServicio.crear(
      asignacionDePuestosDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }
}
