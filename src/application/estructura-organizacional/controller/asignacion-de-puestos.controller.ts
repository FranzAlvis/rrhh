import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AsignacionDePuestosService } from '../service/asignacion-de-puestos.service'
import { CrearAsignacionDePuestosDto } from '../dto/crear-asignacion-de-puestos.dto'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base/base-controller'
import { ActualizarAsignacionDePuestosDto } from '../dto/actualizar-asignacion-de-puestos.dto'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Asignación de Puestos')
@Controller('asignacion-de-puestos')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class AsignacionDePuestosController extends BaseController {
  constructor(private asignacionDePuestosServicio: AsignacionDePuestosService) {
    super()
  }

  @Get(':id/listar')
  async listar(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Param() params: ParamIdDto
  ) {
    const { id: idOrganigrama } = params
    const result = await this.asignacionDePuestosServicio.listar(
      paginacionQueryDto,
      idOrganigrama
    )
    return this.successListRows(result)
  }

  @Get(':id/listar-todo')
  async listarTodo(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Param() params: ParamIdDto
  ) {
    const { id: idOrganigrama } = params
    const result = await this.asignacionDePuestosServicio.listarTodo(
      paginacionQueryDto,
      idOrganigrama
    )
    return this.successListRows(result)
  }

  @Get('ultimo/numeroitem')
  async listarUltimoItem() {
    const result = await this.asignacionDePuestosServicio.listarUltimoItem()
    return this.successList(result)
  }

  @Post()
  async crear(
    @Req() req,
    @Body() asignacionDePuestosDto: CrearAsignacionDePuestosDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.asignacionDePuestosServicio.crear(
      asignacionDePuestosDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() asignacionDePuestosDto: ActualizarAsignacionDePuestosDto
  ) {
    const { id: idAsignacionDePuestos } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.asignacionDePuestosServicio.actualizarDatos(
      idAsignacionDePuestos,
      asignacionDePuestosDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idAsignacionDePuestos } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.asignacionDePuestosServicio.activar(
      idAsignacionDePuestos,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idAsignacionDePuestos } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.asignacionDePuestosServicio.inactivar(
      idAsignacionDePuestos,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Delete('/:id')
  async eliminar(@Param('id') id) {
    const result =
      await this.asignacionDePuestosServicio.eliminarAsignacionDePuestos(id)
    return this.successDelete(result)
  }

  @Get('gestion-actual')
  async listarAsignacionesPuestoPorGestionActual() {
    const result =
      await this.asignacionDePuestosServicio.listarAsignacionesPuestoPorGestionActual()
    return this.successList(result)
  }
}
