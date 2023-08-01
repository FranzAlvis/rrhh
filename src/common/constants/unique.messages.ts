import { Messages } from './response-messages'
import { UnidadOrganizacionalMessages } from './unidad.organizacional.messages'

export const UniqueColumnMessage = {
  usuario: {
    usuario: Messages.EXISTING_USER_NAME,
    correoElectronico: Messages.EXISTING_EMAIL,
    nroRegistroProfesional: Messages.EXISTING_USER_NRO_REGISTRO_PROFESIONAL,
    nroFuncionarioCarrera: Messages.EXISTING_USER_NRO_FUNCIONARIO_CARRERA,
  },
  persona: {
    correoElectronicoPersonal: Messages.EXISTING_PERSONAL_EMAIL,
    nroDocumento: Messages.EXISTING_NRO_DOCUMENTO,
    nroLibretaServicioMilitar: Messages.EXISTING_PERSONA_LIBRETA_MILITAR,
  },
  unidadorganizacional: {
    sigla: UnidadOrganizacionalMessages.EXISTING_SIGLA_UNIDAD_ORGANIZACIONAL,
    nombre: UnidadOrganizacionalMessages.EXISTING_NOMBRE_UNIDAD_ORGANIZACIONAL,
  },
  asignaciondepuestos: {
    nro_item: UnidadOrganizacionalMessages.EXISTING_NRO_ASIGNACION_DE_PUESTOS,
  },
}
