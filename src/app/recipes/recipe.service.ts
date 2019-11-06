/**
 * DEPRECATED CODE
 *
 * The RecipeService originally managed the state of the recipes module.
 *
 * However, we shifted to use NgRx to manage the recipes state.
 * We are keeping the RecipeService class file as reference.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';

// @Injectable({
//     providedIn: 'root'
// })
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];

    constructor(private store: Store<fromApp.AppState>) {}

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipeById(id: number) {
        if (id >= 0 && id < this.recipes.length) {
            return this.getRecipes()[id];
        } else {
            return null;
        }
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.getRecipes());
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.getRecipes());
    }

    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.recipesChanged.next(this.getRecipes());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.getRecipes());
    }
}
