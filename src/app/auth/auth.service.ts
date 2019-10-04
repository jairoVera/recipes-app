import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly userSession = 'userData';

    user = new BehaviorSubject<User>(null);
    tokenExpirationTimeout: any;

    constructor(private http: HttpClient, private router: Router) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebase_API_KEY,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap(responseData => {
                this.handleAuthentication(
                    responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn
                );
            }),
            catchError(this.handleError)
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebase_API_KEY,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap(responseData => {
                this.handleAuthentication(
                    responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn
                );
            }),
            catchError(this.handleError)
        );
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem(this.userSession));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);

            // Calculate time left in miliseconds
            const exporationDuration =
                new Date(userData._tokenExpirationDate).getTime() -
                new Date().getTime();

            this.autoLogout(exporationDuration);
        }
    }

    logout() {
        if (this.tokenExpirationTimeout) {
            clearTimeout(this.tokenExpirationTimeout);
        }
        this.tokenExpirationTimeout = null;

        this.user.next(null);
        localStorage.removeItem(this.userSession);

        this.router.navigate(['/auth']);
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimeout = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        );

        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem(this.userSession, JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error ocurred!';

        if (!errorResponse.error || !errorResponse.error.error) {
            console.log(errorResponse);
            return throwError(errorMessage);
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

        return throwError(errorMessage);
    }
}
