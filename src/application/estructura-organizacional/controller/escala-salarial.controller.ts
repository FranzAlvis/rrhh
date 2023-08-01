import { BaseController } from 'src/common/base/base-controller'
import { CrearEscalaSalarialDto } from '../dto/crear-escala-salarial.dto'
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
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { EscalaSalarialService } from '../service/escala-salarial.service'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { ActualizarEscalaSalarialDto } from '../dto/actualizar-escala-salarial.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Escalas Salariales')
@Controller('escalas-salariales')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class EscalaSalarialController extends BaseController {
  constructor(private readonly escalaSalarialService: EscalaSalarialService) {
    super()
  }

  // create item
  @Post()
  async crear(
    @Req() req,
    @Body() crearEscalaSalarialDto: CrearEscalaSalarialDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.escalaSalarialService.crear(
      crearEscalaSalarialDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  //GET entidades - listar
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.escalaSalarialService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  //GET entidades - listar - TODO
  @Get('todo')
  async listarTodo(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.escalaSalarialService.listarTodo(
      paginacionQueryDto
    )
    return this.successListRows(result)
  }

  //Actualizar items
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() escalaSalarialDto: ActualizarEscalaSalarialDto
  ) {
    const { id: idItem } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.escalaSalarialService.actualizarDatos(
      idItem,
      escalaSalarialDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Delete(':id')
  async eliminar(@Param('id') id) {
    const result = await this.escalaSalarialService.eliminarEscalaSalarial(id)
    return this.successDelete(result)
  }
}
