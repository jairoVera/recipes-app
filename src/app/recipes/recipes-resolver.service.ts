import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        private actions$: Actions,
        private store: Store<fromApp.AppState>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // TODO?: Implement Get Recipes Locally

        // Kick off a FetchRecipes Action
        // This will eventually kick off a SetRecipes Action
        this.store.dispatch(new RecipesActions.FetchRecipes());

        // Resolver won't return UNTIL it receives the SetRecipes Action from above
        return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
        );
    }
}
