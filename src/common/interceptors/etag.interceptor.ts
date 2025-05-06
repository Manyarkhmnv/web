import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(
            tap((data) => {
                const etag = crypto
                    .createHash('md5')
                    .update(JSON.stringify(data))
                    .digest('base64');

                const clientEtag = req.headers['if-none-match'];

                res.setHeader('ETag', `W/"${etag}"`);

                if (clientEtag === `W/"${etag}"`) {
                    res.status(304).end();
                } else {
                    res.send(data);
                }
            })
        );
    }
}
