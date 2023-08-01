import { Test, TestingModule } from '@nestjs/testing'
import { UnidadOrganizacionalService } from './unidad-organizacional.service'

describe('UnidadOrganizacionalService', () => {
  let service: UnidadOrganizacionalService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnidadOrganizacionalService],
    }).compile()

    service = module.get<UnidadOrganizacionalService>(
      UnidadOrganizacionalService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
