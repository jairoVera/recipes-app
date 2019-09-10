import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user
            .pipe(
                /**
                 * Complete the observable after the 1st emitted value.
                 */
                take(1),
                /**
                 * exhaustMap allows us to subscribe to an "inner" observable.
                 * This allows us to "switch" from the User observable to the Http observable.
                 *
                 * The outside caller method does not know we initially called the User observable
                 * as we returned an HttpObservable.
                 */
                exhaustMap(user => {
                    if (!user) {
                        return next.handle(req);
                    }

                    const modRequest = req.clone({ params: new HttpParams().set('auth', user.token) });
                    return next.handle(modRequest);
                })
            );
    }
}
