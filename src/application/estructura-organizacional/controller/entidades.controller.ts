import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common'
import { EntidadesService } from '../service/entidades.service'
import { CrearEntidadDto } from '../dto/crear-entidad.dto'
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { BaseController } from 'src/common/base/base-controller'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { ActualizarEntidadDto } from '../dto/actualizar-entidad.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Entidades')
@Controller('entidades')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class EntidadesController extends BaseController {
  constructor(private readonly entidadesService: EntidadesService) {
    super()
  }
  // CREATE entidades
  @Post()
  async crear(@Req() req, @Body() crearEntidadDto: CrearEntidadDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.entidadesService.crear(
      crearEntidadDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  // GET entidades
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.entidadesService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  // UPDATE entidades
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() entidadDto: ActualizarEntidadDto
  ) {
    const { id: idEntidad } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.entidadesService.actualizarDatos(
      idEntidad,
      entidadDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
