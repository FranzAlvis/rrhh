import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import { ValidationMessageEnum } from './i18n/es.enum'

const expLibreta = /^[0-9]{2}-[0-9]{6}-[0-9]{1}$/

export const NRO_LIBRETA_SERVICIO_MILITAR = 'nroLibretaServicioMilitar'

/**
 * Verifica si una cadena de nro de libreta de servico miltar es válido
 * @param value cadena a validar
 * @returns Si el valor dado no cumple, devuelve falso.
 */

export function nroLibretaServicoMilitar(value?: string | null): boolean {
  const regex = new RegExp(expLibreta)
  return value ? regex.test(value) : false
}

export function NroLibretaServicoMilitar(
  validationsOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'NRO_LIBRETA_SERVICIO_MILITAR',
      constraints: [],
      validator: {
        validate: (value): boolean => nroLibretaServicoMilitar(value),
        defaultMessage: buildMessage(
          () => ValidationMessageEnum.NRO_LIBRETA_SERVICIO_MILITAR,
          validationsOptions
        ),
      },
    },
    validationsOptions
  )
}
