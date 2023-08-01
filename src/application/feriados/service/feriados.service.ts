import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Messages } from 'src/common/constants/response-messages'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { ActualizarFeriadoDto } from '../dto/actualizar-feriados.dto'
import { CrearFeriadoDto } from '../dto/crear-feriados.dto'
import { Feriados } from '../entity/feriados.entity'
import { FeriadosRepository } from '../repository/feriados.repository'

@Injectable()
export class FeriadosService {
  constructor(private feriadosRepository: FeriadosRepository) {}

  async crearFeriado(crearFeriadoDto: CrearFeriadoDto, usuarioAuditoria: any) {
    const { nombre } = crearFeriadoDto
    try {
      const existeNombre = await this.feriadosRepository.buscarNombre(nombre)
      if (existeNombre) {
        throw new NotFoundException('Ya existe un feriado con el mismo nombre')
      }
      return await this.feriadosRepository.crear(
        crearFeriadoDto,
        usuarioAuditoria
      )
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('Error', error.message)
        throw new NotFoundException(error.message)
      } else {
        console.log('Unhandled error:', error)
      }
    }
  }

  async obtenerFeriado(id: string): Promise<Feriados | null> {
    try {
      return await this.feriadosRepository.buscarPorId(id)
    } catch (error) {
      throw new Error(error)
    }
  }

  async actualizarFeriado(
    id: string,
    actualizarFeriadoDto: ActualizarFeriadoDto,
    usuarioAuditoria: string
  ) {
    try {
      await this.validarFeriadoPorId(id)
      await this.feriadosRepository.actualizar(
        id,
        actualizarFeriadoDto,
        usuarioAuditoria
      )
      return { id }
    } catch (error) {
      throw new Error(error)
    }
  }

  protected async validarFeriadoPorId(id: string) {
    try {
      const feriado = await this.feriadosRepository.buscarPorId(id)
      if (!feriado) {
        throw new BadRequestException(Messages.EXCEPTION_NOT_FOUND)
      }
      return feriado
    } catch (error) {
      throw new Error(error)
    }
  }

  async eliminarFeriado(id: string): Promise<void> {
    try {
      await this.validarFeriadoPorId(id)
      await this.feriadosRepository.eliminar(id)
    } catch (error) {
      throw new Error(error)
    }
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    try {
      return await this.feriadosRepository.listar(paginacionQueryDto)
    } catch (error) {
      throw new Error(error)
    }
  }

  async listarPorId(id: string) {
    try {
      return await this.validarFeriadoPorId(id)
    } catch (error) {
      throw new Error(error)
    }
  }
}
