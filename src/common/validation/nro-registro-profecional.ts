import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import { ValidationMessageEnum } from './i18n/es.enum'

const expNroProfecional = /^[a-zA-Z0-9]+$/

export const NRO_REGISTRO_PROFECIONAL = 'nroRegistroProfesional'

/**
 * Verifica si nro de regristro profecional es válido
 * @param value cadena a validar
 * @returns Si el valor dado no cumple, devuelve falso.
 */

export function nroRegistroProfesional(value?: string | null): boolean {
  const regex = new RegExp(expNroProfecional)
  return value ? regex.test(value) : false
}

export function NroRegistroProfesional(
  validationsOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'NRO_REGISTRO_PROFECIONAL',
      constraints: [],
      validator: {
        validate: (value): boolean => nroRegistroProfesional(value),
        defaultMessage: buildMessage(
          () => ValidationMessageEnum.NRO_REGISTRO_PROFECIONAL,
          validationsOptions
        ),
      },
    },
    validationsOptions
  )
}
