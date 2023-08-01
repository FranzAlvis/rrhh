import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { PersonaDto } from '../../../usuario/dto/persona.dto'
import { DevelopmentSegipService } from './development.segip.service'

describe('DevelopmentSegipService', () => {
  let service: DevelopmentSegipService
  const datosPersona = {
    nroDocumento: '123112',
    fechaNacimiento: '1999-11-11',
    nombres: 'JUAN',
    primerApellido: 'PEREZ',
    segundoApellido: 'LOPEZ',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopmentSegipService],
      imports: [HttpModule],
    }).compile()

    service = module.get<DevelopmentSegipService>(DevelopmentSegipService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('contrastar', () => {
    it('Deberia retornar un finalizado como true', async () => {
      const persona = plainToClass(PersonaDto, datosPersona)
      const respuesta = await service.contrastar(persona)
      expect(respuesta).toBeDefined()
      expect(respuesta).toHaveProperty('finalizado')
      expect(respuesta?.finalizado).toEqual(true)
      expect(respuesta?.mensaje).toBe(
        'Servicio Segip: Development mode: sin contrastar'
      )
    })
  })
})
