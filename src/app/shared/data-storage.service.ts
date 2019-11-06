/**
 * DEPRECATED CODE
 *
 * The DataStorageService originally managed the API calls to the Firebase database.
 *
 * However, we shifted to use NgRx Effects (RecipesEffects class) to handle the API calls.
 * We are keeping the DataStorageService class file as a reference.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';

// @Injectable({
//     providedIn: 'root'
// })
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();

        this.http
            .put('https://ng-recipe-book-5a48c.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>('https://ng-recipe-book-5a48c.firebaseio.com/recipes.json')
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingridients: recipe.ingridients ? recipe.ingridients : []
                        };
                    });
                }),
                tap(recipes => {
                    this.store.dispatch(new RecipesActions.SetRecipes(recipes));
                })
            );
    }
}
