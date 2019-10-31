import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebase_API_KEY,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(responseData => {
                    const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);

                    return new AuthActions.Login({
                        email: responseData.email,
                        userId: responseData.localId,
                        token: responseData.idToken,
                        expirationDate: expirationDate
                    });
                }),
                catchError(error => {
                    // Convert error to Observable to keep the Observable Stream alive
                    return this.handleError(error);
                })
            );
        })
    );

    // Tell NgRx Effects that this effect does not dispatch an Action
    @Effect({dispatch: false})
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
            this.router.navigate(['/recipes']);
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) {}

    private handleError(errorResponse: HttpErrorResponse): Observable<AuthActions.LoginFail> {
        let errorMessage = 'An unknown error ocurred!';

        if (!errorResponse.error || !errorResponse.error.error) {
            console.log(errorResponse);
            return of(new AuthActions.LoginFail(errorMessage));
        }

        switch (errorResponse.error.error.message) {
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password is invalid or the user does not have a password.';
                break;
            case 'USER_DISABLED':
                errorMessage = 'The user account has been disabled by an administrator.';
                break;
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account.';
                break;
            default:
                console.log(errorResponse);
        }

        return of(new AuthActions.LoginFail(errorMessage));
    }
}