import { Test, TestingModule } from '@nestjs/testing'
import { JustificacionService } from './justificacion.service'

describe('JustificacionService', () => {
  let service: JustificacionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JustificacionService],
    }).compile()

    service = module.get<JustificacionService>(JustificacionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
