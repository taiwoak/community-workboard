import { NestInterceptor, ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data.toObject === 'function') {
          return instanceToPlain(data.toObject());
        }

        if (Array.isArray(data)) {
          return data.map((item) =>
            typeof item?.toObject === 'function'
              ? instanceToPlain(item.toObject())
              : instanceToPlain(item)
          );
        }

        return instanceToPlain(data);
      }),
    );
  }
}