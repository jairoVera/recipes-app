import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private store: Store<fromApp.AppState>) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        /**
         * user BehaviorSubject returns previously emitted User object.
         * If User is null, then prevent navigation.
         */
        return this.store.select('auth').pipe(
            take(1),    // Take only 1 emitted value & then unsubscribe
            map(authState => authState.user),
            map(user => {
                const isAuth = !user ? false : true;

                if (isAuth) {
                    return true;
                } else {
                    return this.router.createUrlTree(['/auth']);
                }
            }));
      }
}
