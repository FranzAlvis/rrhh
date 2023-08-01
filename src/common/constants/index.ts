export const SWAGGER_API_ROOT = 'api/docs'
export const SWAGGER_API_NAME = 'Sistema de Recursos Humanos'
export const SWAGGER_API_DESCRIPTION = 'Documentación de APIs'
export const SWAGGER_API_CURRENT_VERSION = '1.0'

export enum Status {
  CREATE = 'CREADO',
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
  PENDING = 'PENDIENTE',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TipoDocumento {
  CI = 'CI',
  PASAPORTE = 'PASAPORTE',
  OTRO = 'OTRO',
}

export enum Genero {
  MASCULINO = 'M',
  FEMENINO = 'F',
  OTRO = 'OTRO',
}

export enum Transacccion {
  CREAR = 'CREAR',
  ACTUALIZAR = 'ACTUALIZAR',
}

export enum EstadosOrganigramas {
  NUEVO = 'NUEVO',
  ELABORACION = 'ELABORACION',
  REVISION = 'REVISION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

export const USUARIO_SISTEMA = '1'
export const USUARIO_NORMAL = '0'
