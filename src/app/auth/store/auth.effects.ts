import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap, switchMapTo } from 'rxjs/operators';
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

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) {}

    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebase_API_KEY,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(response => this.handleSuccess(
                    response.email,
                    response.localId,
                    response.idToken,
                    +response.expiresIn
                )),
                // Convert error to Observable to keep the Observable Stream alive
                catchError(error => this.handleError(error))
            );
        })
    );

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
                map(response => this.handleSuccess(
                    response.email,
                    response.localId,
                    response.idToken,
                    +response.expiresIn
                )),
                catchError(error => this.handleError(error))
            );
        })
    );

    // Tell NgRx Effects that this effect does not dispatch an Action
    @Effect({dispatch: false})
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/recipes']);
        })
    );

    // Tell NgRx Effects that this effect does not dispatch an Action
    @Effect({dispatch: false})
    authLogOut = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.router.navigate(['/auth']);
        })
    );

    private handleSuccess(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        return new AuthActions.AuthenticateSuccess({
            email: email,
            userId: userId,
            token: token,
            expirationDate: expirationDate
        });
    }

    private handleError(errorResponse: HttpErrorResponse): Observable<AuthActions.AuthenticateFail> {
        let errorMessage = 'An unknown error ocurred!';

        if (!errorResponse.error || !errorResponse.error.error) {
            console.log(errorResponse);
            return of(new AuthActions.AuthenticateFail(errorMessage));
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

        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
}