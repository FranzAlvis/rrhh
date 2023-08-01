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
import { JustificacionService } from '../service/justificacion.service'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { CrearJustificacionDto } from '../dto/crear-justificacion.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { ActualizarJustificacionDto } from '../dto/actualizar-justificacion.dto'

@ApiTags('Justificaciones')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('permisos/justificaciones')
export class JustificacionController extends BaseController {
  constructor(private readonly justificacionService: JustificacionService) {
    super()
  }

  @ApiProperty({ description: 'Listar las justificaciones' })
  @Get()
  listar() {
    return this.justificacionService.listar()
  }

  @ApiProperty({ description: 'Listar todos las justificaciones' })
  @Get('todos')
  async listarTodos(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.justificacionService.listarTodos(
      paginacionQueryDto
    )
    return this.successListRows(result)
  }

  @ApiProperty({ description: 'Crear justificaciones' })
  @Post()
  async crear(@Req() req, @Body() justificacionDto: CrearJustificacionDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.justificacionService.crear(
      justificacionDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiProperty({ description: 'Actualiza los justificaciones' })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() justificacionDto: ActualizarJustificacionDto
  ) {
    const { id: idJustificacion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.justificacionService.actualizar(
      idJustificacion,
      justificacionDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiProperty({ description: 'Hacer activacion de estado' })
  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idJustificacion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.justificacionService.activar(
      idJustificacion,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiProperty({ description: 'Hacer desactivado de estado' })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idJustificacion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.justificacionService.inactivar(
      idJustificacion,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
