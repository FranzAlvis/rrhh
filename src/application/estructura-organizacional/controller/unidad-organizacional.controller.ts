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
import { UnidadOrganizacionalService } from '../service/unidad-organizacional.service'
import { CrearUnidadOrganizacionalDto } from '../dto/crear-unidad-organizacional.dto'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base/base-controller'
import { ActualizarUnidadOrganizacionalDto } from '../dto/actualizar-unidad-organizacional.dto'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Unidades Organizacionales')
@Controller('unidades-organizacionales')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UnidadOrganizacionalController extends BaseController {
  constructor(
    private unidadOrganizacionalServicio: UnidadOrganizacionalService
  ) {
    super()
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.unidadOrganizacionalServicio.listar(
      paginacionQueryDto
    )
    return this.successListRows(result)
  }

  @Get('todo')
  async listarTodo(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.unidadOrganizacionalServicio.listarTodo(
      paginacionQueryDto
    )
    return this.successListRows(result)
  }

  @Get(':id/dependientes')
  async listarPorDependencia(@Param() params: ParamIdDto) {
    console.log(params)
    const { id: idUnidadOrganizacional } = params
    const result = await this.unidadOrganizacionalServicio.listarDependientes(
      idUnidadOrganizacional
    )
    return this.successList(result)
  }

  @Get('arbol')
  async arbolDeUnidadesOrganizacionales() {
    const result =
      await this.unidadOrganizacionalServicio.arbolDeUnidadesOrganizacionales()
    return this.successList(result)
  }

  @Post()
  async crear(
    @Req() req,
    @Body() unidadOrganizacionalDto: CrearUnidadOrganizacionalDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadOrganizacionalServicio.crear(
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() unidadOrganizacionalDto: ActualizarUnidadOrganizacionalDto
  ) {
    const { id: idUnidadOrganizacional } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadOrganizacionalServicio.actualizarDatos(
      idUnidadOrganizacional,
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idUnidadOrganizacional } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadOrganizacionalServicio.activar(
      idUnidadOrganizacional,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idUnidadOrganizacional } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadOrganizacionalServicio.inactivar(
      idUnidadOrganizacional,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Delete('/:id')
  async eliminar(@Param('id') id) {
    const result =
      await this.unidadOrganizacionalServicio.eliminarNodoUnidadOrganizacional(
        id
      )
    return this.successDelete(result)
  }
}
