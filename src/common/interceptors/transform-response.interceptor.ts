import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface PartialResponse<T = unknown> {
  message?: string
  data?: T
}

interface ApiResponse<T = unknown> {
  code: string
  message: string
  data?: T | null
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((res: PartialResponse<T>) => ({
        // TODO: Enum ?
        code: 'Success',
        message: res.message ?? 'Operation completed successfully',
        data: res.data ?? null,
      })),
    )
  }
}
