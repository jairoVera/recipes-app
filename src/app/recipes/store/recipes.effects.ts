import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipesEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>) {}

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap((recipesData: RecipesActions.FetchRecipes) => {
            return this.http.get<Recipe[]>(
                'https://ng-recipe-book-5a48c.firebaseio.com/recipes.json'
            );
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingridients: recipe.ingridients ? recipe.ingridients : []
                };
            });
        }),
        map(recipes => new RecipesActions.SetRecipes(recipes))
    );

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        tap(([actionData, recipesState]) => {
            this.http
                .put('https://ng-recipe-book-5a48c.firebaseio.com/recipes.json', recipesState.recipes)
                .subscribe(response => {
                    console.log(response);
                });
        })
    );
}
