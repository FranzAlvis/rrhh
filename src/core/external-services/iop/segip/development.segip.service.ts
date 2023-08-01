import { Injectable } from '@nestjs/common'
import { ExternalServiceException } from '../../../../common/exceptions/external-service.exception'
import { PersonaDto } from '../../../usuario/dto/persona.dto'
import { HttpService } from '@nestjs/axios'
import { BaseExternalService } from '../../../../common/base/base-external-service'

@Injectable()
export class DevelopmentSegipService extends BaseExternalService {
  constructor(private readonly httpService: HttpService) {
    super(httpService)
  }

  /**
   * @title Contrastación
   * @description Método para verificar si la información de una persona coincide con un registro en el SEGIP
   * @param datosPersona Objeto de datos con la información de la persona
   * @param retornarPrimerError Bandera para retornar solo el primer error en contrastación
   */
  async contrastar(datosPersona: PersonaDto, retornarPrimerError = true) {
    try {
      this.logger.info(`🚀 (Development - Mode) Sin Contrastar Segip`)
      const exito = true
      const mensaje = 'Development mode: sin contrastar'
      return this.armarRespuesta(exito, mensaje)
    } catch (error) {
      throw new ExternalServiceException('SEGIP:CONTRASTACION', error)
    }
  }

  armarRespuesta(
    exito: boolean,
    mensaje: string
  ): { finalizado: boolean; mensaje: string } {
    return {
      finalizado: exito,
      mensaje: `Servicio Segip: ${mensaje}`,
    }
  }
}
