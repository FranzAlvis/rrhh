import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import { ValidationMessageEnum } from './i18n/es.enum'

const expNroFuncionario = /^[a-zA-Z0-9]+$/

export const NRO_FUNCIONARIO_CARRERA = 'nroFuncionarioCarrera'

/**
 * Verifica si la cadena de nro de funcionario carrera es válido
 * @param value cadena a validar
 * @returns Si el valor dado no cumple, devuelve falso.
 */

export function nroFuncionarioCarrera(value?: string | null): boolean {
  const regex = new RegExp(expNroFuncionario)
  return value ? regex.test(value) : false
}

export function NroFuncionarioCarrera(
  validationsOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'NRO_FUNCIONARIO_CARRERA',
      constraints: [],
      validator: {
        validate: (value): boolean => nroFuncionarioCarrera(value),
        defaultMessage: buildMessage(
          () => ValidationMessageEnum.NRO_FUNCIONARIO_CARRERA,
          validationsOptions
        ),
      },
    },
    validationsOptions
  )
}
