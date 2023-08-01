import { BaseController } from 'src/common/base/base-controller'
import { OrganigramaService } from '../service/organigrama.service'
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
import { CrearOrganigramaDto } from '../dto/crear-organigrama.dto'
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { ActualizarOrganigramaDto } from '../dto/actualizar-organigrama.dto'
import { AsignacionDePuestosService } from '../service/asignacion-de-puestos.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Organigramas')
@Controller('organigramas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class OrganigramaController extends BaseController {
  constructor(
    private organigramaService: OrganigramaService,
    private asignacionDePuestosServicio: AsignacionDePuestosService
  ) {
    super()
  }

  //create organigrama
  @Post()
  async crear(@Req() req, @Body() crearOrganigramaDto: CrearOrganigramaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.organigramaService.crear(
      crearOrganigramaDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  // GET listar
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.organigramaService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Get(':id')
  async getDetalleOrganigrama(@Param('id') id: number) {
    return await this.asignacionDePuestosServicio.getOrganigramaPorId(id)
  }

  @Get('ultimo/version')
  async getUltimoOrganigrama() {
    return await this.organigramaService.ultimoOrganigrama()
  }

  //Actualizar organigram
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() organigramaDto: ActualizarOrganigramaDto
  ) {
    const { id: idOrganigrama } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.organigramaService.actualizarDatos(
      idOrganigrama,
      organigramaDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  //aprobar organigrama
  @Get(':id/aprobar')
  async aprobarOrganigrama(@Param() params: ParamIdDto, @Req() req) {
    const { id: idOrganigrama } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.organigramaService.aprobarOrganigrama(
      idOrganigrama,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Get(':id/revision')
  async revisionOrganigrama(@Param() params: ParamIdDto, @Req() req) {
    const { id: idOrganigrama } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.organigramaService.revisarOrganigrama(
      idOrganigrama,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  //rechazar organigrama
  @Get(':id/rechazar')
  async rechazarOrganigrama(@Param() params: ParamIdDto, @Req() req) {
    const { id: idOrganigrama } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.organigramaService.rechazarOrganigrama(
      idOrganigrama,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const result = await this.organigramaService.eliminar(id)
    return this.successDelete(result)
  }
}
