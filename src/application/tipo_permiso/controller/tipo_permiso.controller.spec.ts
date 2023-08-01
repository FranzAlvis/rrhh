import { Test, TestingModule } from '@nestjs/testing'
import { TipoPermisoController } from './tipo_permiso.controller'
import { TipoPermisoService } from '../service/tipo_permiso.service'
describe('TipoPermisoController', () => {
  let controller: TipoPermisoController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoPermisoController],
      providers: [TipoPermisoService],
    }).compile()

    controller = module.get<TipoPermisoController>(TipoPermisoController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
