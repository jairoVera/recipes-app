import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';

import * as RecipesActions from '../store/recipes.actions';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipesEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient) {}

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
}
