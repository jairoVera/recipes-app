import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenExpirationTimeout: any;

    constructor(private store: Store<fromApp.AppState>) {}

    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimeout = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimeout) {
            clearTimeout(this.tokenExpirationTimeout);
        }
        this.tokenExpirationTimeout = null;
    }
}
