import { Test, TestingModule } from '@nestjs/testing'
import { FeriadosService } from '../service/feriados.service'
import { FeriadosController } from './feriados.controller'

describe('FeriadosController', () => {
  let controller: FeriadosController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeriadosController],
      providers: [FeriadosService],
    }).compile()

    controller = module.get<FeriadosController>(FeriadosController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
