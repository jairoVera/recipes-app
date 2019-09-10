import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        /**
         * user BehaviorSubject returns previously emitted User object.
         * If User is null, then prevent navigation.
         */
        return this.authService.user.pipe(
            take(1),    // Take only 1 emitted value & then unsubscribe
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
