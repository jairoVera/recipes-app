import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService, AuthResponseData } from './auth.service';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  @ViewChild('authForm', { static: false }) form: NgForm;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  isLoginMode = true;
  isLoading = false;
  error = null;

  private alertCloseSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private compFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;

      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({
        email: email,
        password: password
      }));
    } else {
      authObs = this.authService.signUp(email, password);
    }

    // authObs.subscribe(
    //   responseData => {
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   }, errorMessage => {
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );

    this.form.reset();
  }

  onCloseAlert() {
    this.error = null;
  }

  ngOnDestroy() {
    if (this.alertCloseSub) {
      this.alertCloseSub.unsubscribe(); 
    }
  }

  private showErrorAlert(message: string) {
    // Create a Factory
    const alertCompFactory = this.compFactoryResolver.resolveComponentFactory(AlertComponent);

    // Get the viewContainerRef for the host ng-template
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear(); // clear any previous added components, etc..

    // Pass component factory to .createComponent method to
    // create and attach the component to the ng-template w/ PlaceholderDirective
    const compRef = hostViewContainerRef.createComponent(alertCompFactory);

    compRef.instance.message = message;

    this.alertCloseSub = compRef.instance.close.subscribe(() => {
      this.alertCloseSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
