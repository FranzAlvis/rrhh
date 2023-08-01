import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import { ValidationMessageEnum } from './i18n/es.enum'

const expNombreUsuario = /^[a-z]+(\.[a-z]+)*$/

export const NOMBRE_USUARIO = 'usuario'

/**
 * Verifica si la cadena de nombre de usuario es válido
 * @param value cadena a validar
 * @returns Si el valor dado no es una cadena, devuelve falso.
 */

export function nombreUsuario(value?: string | null): boolean {
  const regex = new RegExp(expNombreUsuario)
  return value ? regex.test(value) : false
}

export function NombreUsuario(
  validationsOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'NOMBRE_USUARIO',
      constraints: [],
      validator: {
        validate: (value): boolean => nombreUsuario(value),
        defaultMessage: buildMessage(
          () => ValidationMessageEnum.NOMBRE_USUARIO,
          validationsOptions
        ),
      },
    },
    validationsOptions
  )
}
