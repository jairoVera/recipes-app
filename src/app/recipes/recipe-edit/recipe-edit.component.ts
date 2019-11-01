import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeForm: FormGroup;

  id = -1;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        this.id = (params['id']) ? +params['id'] : -1;
        this.editMode = this.id !== -1;
        this.initForm();
    });
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingridients']
    // );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngridient() {
    (<FormArray>this.recipeForm.get('ingridients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onDeleteIngridient(index: number) {
    (<FormArray>this.recipeForm.get('ingridients')).removeAt(index);
  }

  get ingridientControls() {
    return (<FormArray>this.recipeForm.get('ingridients')).controls;
  }

  private initForm() {
    let recipeName = '';
    let imagePath = '';
    let description = '';
    const ingridients = new FormArray([]);

    if (this.editMode) {
      this.store.select('recipes').pipe(
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      ).subscribe(recipe => {
        recipeName = recipe.name;
        imagePath = recipe.imagePath;
        description = recipe.description;

        if (recipe.ingridients !== undefined && recipe.ingridients !== null) {
          recipe.ingridients.forEach(i => {
            ingridients.push(new FormGroup({
              'name': new FormControl(i.name, Validators.required),
              'amount': new FormControl(i.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }));
          });
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingridients': ingridients
    });
  }
}
