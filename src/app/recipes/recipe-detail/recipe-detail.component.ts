import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipeId: number;
  recipe: Recipe;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => +params['id']),

        // switchMap resolves an inner Observable
        // and returns the object WITHIN the Observable
        switchMap(recipeId => {
          this.recipeId = recipeId;
          return this.store.select('recipes');
        }),

        // Without switchMap, we would have received an Observable<State>
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.recipeId;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  onSelectToShoppingList() {
    //this.recipeService.addIngridientsToShoppingList(this.recipe.ingridients.slice());
    this.store.dispatch(new ShoppingListActions.AddIngridients(this.recipe.ingridients));
  }

  onDeleteRecipe() {
    //this.recipeService.deleteRecipe(this.recipeId);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipeId));
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
