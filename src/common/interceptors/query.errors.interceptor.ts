import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { catchError, Observable } from 'rxjs'
import { PG_UNIQUE_VIOLATION } from 'src/common/constants/postgres-error-codes'
import { UniqueColumnMessage } from 'src/common/constants/unique.messages'
import { DataSource, EntityMetadata, QueryFailedError } from 'typeorm'
@Injectable()
export class QueryErrorsInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof QueryFailedError) {
          const err = error.driverError
          if (err.code === PG_UNIQUE_VIOLATION) {
            const table: EntityMetadata = this.dataSource.getMetadata(err.table)
            const index = table.ownUniques.findIndex(
              (unique) => unique.name === err.constraint
            )
            const uniqueMetadata = table.ownUniques[index]
            const entity = table.name.toLocaleLowerCase()
            const keyName = uniqueMetadata.columns[0].propertyName
            const message = UniqueColumnMessage[entity][keyName]

            if (message) throw new ConflictException(message)
            throw new ConflictException(err.detail)
          }
        }
        throw error
      })
    )
  }
}
