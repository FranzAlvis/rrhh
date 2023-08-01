import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common'
import { PermisoService } from '../service/permiso.service'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { BaseController } from 'src/common/base/base-controller'
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearPermisoDto } from '../dto/crear-permiso.dto'
import { ActualizarPermisoDto } from '../dto/actualizar-permiso.dto'
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Permisos')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('permisos')
export class PermisoController extends BaseController {
  constructor(private permisoService: PermisoService) {
    super()
  }
  @ApiProperty({ description: 'Listar los permisos' })
  @Get()
  async listar() {
    const result = await this.permisoService.listar()
    return this.successList(result)
  }

  @ApiProperty({ description: 'Listar todos los permisos' })
  @Get('todos')
  async listarTodos(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.permisoService.listarTodos(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiProperty({ description: 'Crear permisos' })
  @Post()
  async crear(@Req() req, @Body() permisoDto: CrearPermisoDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.permisoService.crear(permisoDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiProperty({ description: 'Actualiza los permisos' })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() permisoDto: ActualizarPermisoDto
  ) {
    const { id: idPermiso } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.permisoService.actualizar(
      idPermiso,
      permisoDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiProperty({ description: 'Hacer activacion de estado' })
  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idPermiso } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.permisoService.activar(
      idPermiso,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiProperty({ description: 'Hacer desactivado de estado' })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idPermiso } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.permisoService.inactivar(
      idPermiso,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
