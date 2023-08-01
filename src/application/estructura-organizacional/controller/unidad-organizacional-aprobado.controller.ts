import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CrearUnidadOrganizacionalDto } from '../dto/crear-unidad-organizacional.dto'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base/base-controller'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { UnidadOrganizacionalAprobadoService } from '../service/unidad-organizacional-aprobado.service'

@ApiTags('Unidades Organizacionales Aprobadas')
@Controller('unidades-organizacionales-aprobados')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UnidadOrganizacionalAprobadoController extends BaseController {
  constructor(
    private unidadOrganizacionalAprobadoServicio: UnidadOrganizacionalAprobadoService
  ) {
    super()
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.unidadOrganizacionalAprobadoServicio.listar(
      paginacionQueryDto
    )
    return this.successListRows(result)
  }

  @Get(':id/dependientes')
  async listarPorDependencia(@Param() params: ParamIdDto) {
    console.log(params)
    const { id: idUnidadOrganizacionalAprobado } = params
    const result =
      await this.unidadOrganizacionalAprobadoServicio.listarDependientes(
        idUnidadOrganizacionalAprobado
      )
    return this.successList(result)
  }

  @Get('arbol')
  async arbolDeUnidadesOrganizacionalesAprobados() {
    const result =
      await this.unidadOrganizacionalAprobadoServicio.arbolDeUnidadesOrganizacionales()
    return this.successList(result)
  }

  @Post()
  async crear(
    @Req() req,
    @Body() unidadOrganizacionalDto: CrearUnidadOrganizacionalDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadOrganizacionalAprobadoServicio.crear(
      unidadOrganizacionalDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }
}
