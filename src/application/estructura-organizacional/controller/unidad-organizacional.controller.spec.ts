import { Test, TestingModule } from '@nestjs/testing'
import { UnidadOrganizacionalController } from './unidad-organizacional.controller'

describe('UnidadOrganizacionalController', () => {
  let controller: UnidadOrganizacionalController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnidadOrganizacionalController],
    }).compile()

    controller = module.get<UnidadOrganizacionalController>(
      UnidadOrganizacionalController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
