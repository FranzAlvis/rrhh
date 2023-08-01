import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { BaseController } from 'src/common/base/base-controller'
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { TipoPermisoService } from '../service/tipo_permiso.service'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearTipoPermisoDto } from '../dto/crear-tipo_permiso.dto'
import { ActualizarTipoPermisoDto } from '../dto/actualizar-tipo_permiso.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'

@ApiTags('Tipos de Permiso')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('permisos/tipos-de-permisos')
export class TipoPermisoController extends BaseController {
  constructor(private readonly tipoPermisoService: TipoPermisoService) {
    super()
  }

  @ApiProperty({ description: 'Listar todos los tipos de permisos' })
  @Get('todos')
  async listarTodos(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.tipoPermisoService.listarTodos(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiProperty({ description: 'Listar los tipos de permisos' })
  @Get()
  listar() {
    return this.tipoPermisoService.listar()
  }

  @Get(':id')
  async buscarPorId(@Param() params: ParamIdDto) {
    const { id: idTipoPermiso } = params
    const result = await this.tipoPermisoService.obtenerJustificacionPorTipo(
      idTipoPermiso
    )
    return this.success(result)
  }

  @ApiProperty({ description: 'Crear tipos de permiso' })
  @Post()
  async crear(@Req() req, @Body() tipoPermisoDto: CrearTipoPermisoDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tipoPermisoService.crear(
      tipoPermisoDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiProperty({ description: 'Actualiza los tipos de permiso' })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() tipoPermisoDto: ActualizarTipoPermisoDto
  ) {
    const { id: idTipoPermiso } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tipoPermisoService.actualizar(
      idTipoPermiso,
      tipoPermisoDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiProperty({ description: 'Hacer activacion de estado' })
  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idTipoPermiso } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tipoPermisoService.activar(
      idTipoPermiso,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiProperty({ description: 'Hacer desactivado de estado' })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idTipoPermiso } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.tipoPermisoService.inactivar(
      idTipoPermiso,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
