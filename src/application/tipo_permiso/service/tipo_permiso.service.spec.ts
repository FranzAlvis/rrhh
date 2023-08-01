import { Test, TestingModule } from '@nestjs/testing'
import { TipoPermisoService } from './tipo_permiso.service'

describe('TipoPermisoService', () => {
  let service: TipoPermisoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoPermisoService],
    }).compile()

    service = module.get<TipoPermisoService>(TipoPermisoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
