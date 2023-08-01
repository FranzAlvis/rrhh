# Sistema RRHH

## Diccionario de Datos

### Esquema: Estructura Organizacional

#### Tabla `asignacion_puestos`

| Atributo                      | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                             |
| ----------------------------- | ------------ | ----------- | ----------------- | --------------------------------------- |
| id                            | bigint       | No          | No                | Identificador único de la asignación     |
| descripcion_puesto            | varchar(255) | No          | No                | Descripción del puesto                   |
| nro_item                      | integer      | Sí          | No                | Número de ítem                           |
| nivel                         | integer      | No          | No                | Nivel del puesto                         |
| cargo                         | integer      | No          | No                | Cargo del puesto                         |
| id_unidades_organizacionales  | bigint       | No          | No                | ID de la unidad organizacional asociada   |
| id_escala_salarial            | bigint       | No          | No                | ID de la escala salarial asociada         |
| id_organigrama                | bigint       | No          | No                | ID del organigrama asociado              |

#### Tabla `entidades`

| Atributo  | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                    |
| --------- | ------------ | ----------- | ----------------- | ------------------------------ |
| id        | bigint       | No          | No                | Identificador único de la entidad |
| nombre    | varchar(150) | No          | No                | Nombre de la entidad            |
| fuente    | varchar(150) | No          | No                | Fuente de la entidad            |
| organismo | varchar(150) | No          | No                | Organismo de la entidad         |

#### Tabla `escalas_salariales`

| Atributo              | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                             |
| --------------------- | ------------ | ----------- | ----------------- | --------------------------------------- |
| id                    | bigint       | No          | No                | Identificador único de la escala salarial |
| nivel_salarial        | integer      | No          | No                | Nivel salarial                          |
| denominacion_puesto   | varchar(255) | No          | No                | Denominación del puesto                  |
| sueldo_haber_mensual  | decimal(19,2)| No          | No                | Sueldo haber mensual                    |
| tipo                  | varchar(20)  | No          | No                | Tipo                                    |

#### Tabla `organigrama`

| Atributo                     | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                                 |
| ---------------------------- | ------------ | ----------- | ----------------- | ------------------------------------------- |
| id                           | bigint       | No          | No                | Identificador único del organigrama          |
| version                      | varchar(10)  | No          | No                | Versión del organigrama                      |
| gestion                      | integer      | No          | No                | Año de gestión del organigrama               |

#### Tabla `unidades_organizacionales`

| Atributo        | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                                 |
| --------------- | ------------ | ----------- | ----------------- | ------------------------------------------- |
| id              | bigint       | No          | No                | Identificador único de la unidad organizacional |
| nombre          | varchar(50)  | Sí          | No                | Nombre de la unidad organizacional           |
| nivel           | integer      | No          | No                | Nivel jerárquico de la unidad organizacional |
| sigla           | varchar      | Sí          | No                | Sigla de la unidad organizacional            |
| id_dependencia  | bigint       | Sí          | Sí                | Identificador de la unidad organizacional padre |

### Esquema: RRHH

#### Tabla `feriados`

| Atributo        | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                                 |
| --------------- | ------------ | ----------- | ----------------- | ------------------------------------------- |
| id              | bigint       | No          | No                | Identificador único del feriado              |
| nombre          | varchar(100) | Sí          | No                | Nombre del feriado                          |
| fecha           | date         | No          | No                | Fecha del feriado                           |

#### Tabla `justificacion`

| Atributo         | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                                |
| ---------------- | ------------ | ----------- | ----------------- | ------------------------------------------ |
| id               | bigint       | No          | No                | Identificador único de la justificación     |
| nombre           | varchar(255) | No          | No                | Nombre de la justificación                  |
| descripcion      | varchar(255) | Sí          | Sí                | Descripción de la justificación             |
| id_tipo_permiso  | bigint       | No          | No                | ID del tipo de permiso asociado             |

#### Tabla `permiso`

| Atributo            | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                                    |
| ------------------- | ------------ | ----------- | ----------------- | ---------------------------------------------- |
| id                  | bigint       | No          | No                | Identificador único del permiso                 |
| motivo              | varchar(255) | No          | Sí                | Motivo de la solicitud de permiso               |
| lugar               | varchar(255) | No          | Sí                | Lugar de la solicitud de permiso                |
| fecha_inicio        | date         | No          | No                | Fecha de inicio de la solicitud de permiso      |
| hora_inicio         | varchar(5)   | No          | Sí                | Hora de inicio de la solicitud de permiso       |
| fecha_fin           | date         | No          | No                | Fecha de fin de la solicitud de permiso         |
| hora_fin            | varchar(5)   | No          | Sí                | Hora de fin de la solicitud de permiso          |
| id_usuario_solicitante | varchar(50) | No          | No                | Identificador del usuario solicitante del permiso |
| id_usuario_via      | varchar(50) | No          | Sí                | Identificador del usuario para la vía del permiso |
| id_usuario_receptor | varchar(50) | No          | No                | Identificador del usuario receptor del permiso   |
| id_justificacion    | bigint       | No          | No                | Identificador de la justificación del permiso    |
| id_tipo_permiso     | bigint       | No          | No                | Identificador del tipo de permiso               |

#### Tabla `tipo_permiso`

| Atributo     | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                           |
| ------------ | ------------ | ----------- | ----------------- | ------------------------------------- |
| id           | bigint       | No          | No                | Identificador único del tipo de permiso |
| sigla        | varchar(30)  | No          | No                | Sigla del tipo de permiso             |
| nombre       | varchar(255) | No          | No                | Nombre del tipo de permiso            |
| descripcion  | varchar(255) | No          | No                | Descripción del tipo de permiso       |

### Esquema: Parametricas

#### Tabla `parametros`

| Atributo    | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                               |
| ----------- | ------------ | ----------- | ----------------- | ----------------------------------------- |
| id          | bigint       | No          | No                | Identificador único del parámetro          |
| codigo      | varchar(15)  | Sí          | No                | Código del parámetro                       |
| nombre      | varchar(50)  | No          | No                | Nombre del parámetro                       |
| grupo       | varchar(15)  | No          | No                | Grupo al que pertenece el parámetro         |
| descripcion | varchar(255) | No          | No                | Descripción del parámetro                   |

### Esquema: Usuario

#### Tabla `usuarios`

| Atributo                       | Tipo de Dato          | Valor Único | Acepta Valor Nulo | Descripción                                       |
| ------------------------------ | --------------------- | ----------- | ----------------- | ------------------------------------------------- |
| id                             | bigint                | No          | No                | Identificador único del usuario                   |
| nombre_usuario                 | varchar(50)           | Sí          | No                | Nombre de usuario                                 |
| contrasena                     | varchar(255)          | No          | No                | Contraseña del usuario                            |
| ciudadania_digital             | boolean               | No          | No                | Indica si el usuario tiene ciudadanía digital     |
| fecha_asignacion_item          | date                  | Sí          | Sí                | Fecha de asignación del item (opcional)           |
| correo_electronico_institucional | varchar(255)        | Sí          | Sí                | Correo electrónico institucional del usuario (opcional) |
| profesion                      | varchar(255)          | No          | No                | Profesión del usuario                             |
| nro_registro_profesional       | varchar(255)          | Sí          | Sí                | Número de registro profesional del usuario (opcional) |
| nro_funcionario_carrera        | varchar(255)          | Sí          | Sí                | Número de funcionario de carrera del usuario (opcional) |
| intentos                       | integer               | No          | No                | Número de intentos de inicio de sesión             |
| codigo_desbloqueo              | varchar(100)          | Sí          | Sí                | Código de desbloqueo del usuario (opcional)        |
| codigo_recuperacion            | varchar(100)          | Sí          | Sí                | Código de recuperación del usuario (opcional)      |
| codigo_transaccion             | varchar(100)          | Sí          | Sí                | Código de transacción del usuario (opcional)       |
| codigo_activacion              | varchar(100)          | Sí          | Sí                | Código de activación del usuario (opcional)        |
| fecha_bloque

#### Tabla `personas`

| Atributo                       | Tipo de Dato          | Valor Único | Acepta Valor Nulo | Descripción                                       |
| ------------------------------ | --------------------- | ----------- | ----------------- | ------------------------------------------------- |
| id                             | bigint                | No          | No                | Identificador único de la persona                  |
| nombres                        | varchar(100)          | Sí          | Sí                | Nombres de la persona                             |
| primer_apellido                | varchar(100)          | Sí          | Sí                | Primer apellido de la persona                     |
| segundo_apellido               | varchar(100)          | Sí          | Sí                | Segundo apellido de la persona                    |
| tipo_documento                 | varchar(15)           | No          | No                | Tipo de documento de identidad de la persona      |
| correo_electronico_personal    | varchar(255)          | Sí          | Sí                | Correo electrónico personal de la persona (opcional) |
| tipo_documento_otro            | varchar(50)           | Sí          | Sí                | Otro tipo de documento de identidad (opcional)    |
| nro_documento                  | varchar(50)           | Sí          | No                | Número de documento de identidad de la persona    |
| fecha_nacimiento               | date                  | Sí          | Sí                | Fecha de nacimiento de la persona (opcional)      |
| telefono_celular               | varchar(50)           | Sí          | Sí                | Teléfono celular de la persona (opcional)         |
| nro_libreta_servicio_militar   | varchar(30)           | Sí          | Sí                | Número de libreta de servicio militar (opcional)  |
| genero                         | varchar(15)           | Sí          | Sí                | Género de la persona (opcional)                   |
| observacion                    | varchar(255)          | Sí          | Sí                | Observación sobre la persona (opcional)           |

#### Tabla `usuarios_roles`

| Atributo     | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción                        |
| ------------ | ------------ | ----------- | ----------------- | ---------------------------------- |
| id           | bigint       | No          | No                | Identificador único del usuario-rol |
| id_rol       | bigint       | No          | No                | Identificador del rol              |
| id_usuario   | bigint       | No          | No                | Identificador del usuario           |

#### Tabla `roles`

| Atributo | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción             |
| -------- | ------------ | ----------- | ----------------- | ----------------------- |
| id       | bigint       | No          | No                | Identificador único del rol |
| rol      | varchar(50)  | Sí          | No                | Rol                      |
| nombre   | varchar(100) | No          | No                | Nombre                   |

#### Tabla `modulos`

| Atributo    | Tipo de Dato | Valor Único | Acepta Valor Nulo | Descripción         |
| ----------- | ------------ | ----------- | ----------------- | ------------------- |
| id          | bigint       | No          | No                | Identificador único del módulo |
| label       | varchar(50)  | No          | No                | Etiqueta            |
| url         | varchar(100) | Sí          | No                | URL                 |
| nombre      | varchar(50)  | No          | No                | Nombre              |
| propiedades | jsonb        | No          | Sí                | Propiedades         |
| id_modulo   | bigint       | Sí          | Sí                | Identificador del módulo padre |
