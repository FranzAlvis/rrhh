import { Test, TestingModule } from '@nestjs/testing'
import { JustificacionController } from './justificacion.controller'

describe('JustificacionController', () => {
  let controller: JustificacionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JustificacionController],
    }).compile()

    controller = module.get<JustificacionController>(JustificacionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
