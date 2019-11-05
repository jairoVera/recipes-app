import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private store: Store<fromApp.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            /**
             * Complete (unsub) the observable after the 1st emitted value.
             */
            take(1),
            map(authState => authState.user),
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
