import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

@Injectable()
export class DateService {
  static obtenerGestionActual(): number {
    return dayjs().get('year')
  }
}
