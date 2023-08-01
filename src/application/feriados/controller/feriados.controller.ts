import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FeriadosService } from '../service/feriados.service'
import { CrearFeriadoDto } from '../dto/crear-feriados.dto'
import { ActualizarFeriadoDto } from '../dto/actualizar-feriados.dto'
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { BaseController } from 'src/common/base/base-controller'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'

@ApiTags('Feriados')
@Controller('feriados')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class FeriadosController extends BaseController {
  constructor(private readonly feriadosService: FeriadosService) {
    super()
  }

  @Post()
  async crearFeriado(@Req() req, @Body() crearFeriadoDto: CrearFeriadoDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.feriadosService.crearFeriado(
      crearFeriadoDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @Patch(':id')
  async actualizarFeriado(
    @Req() req,
    @Param('id') id: string,
    @Body() actualizarFeriadoDto: ActualizarFeriadoDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.feriadosService.actualizarFeriado(
      id,
      actualizarFeriadoDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Get()
  async listarFeriados(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.feriadosService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Get(':id')
  async obtenerFeriadoPorId(@Param('id') id: string) {
    const result = await this.feriadosService.listarPorId(id)
    return this.successList(result)
  }

  @Delete(':id')
  async eliminarFeriado(@Param('id') id: string) {
    const result = await this.feriadosService.eliminarFeriado(id)
    return this.successDelete(result)
  }
}
