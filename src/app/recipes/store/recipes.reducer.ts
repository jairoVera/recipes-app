import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

export function recipeReducer(
    state = initialState,
    action: RecipesActions.RecipeActions
) {
    switch (action.type) {
        case RecipesActions.FETCH_RECIPES:
            return {
                ...state,
            };
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipesActions.UPDATE_RECIPE:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };

            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe;

            return {
                ...state,
                recipes: updatedRecipes
            };
        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((_, index) => {
                    return index !== action.payload;
                })
            };
        case RecipesActions.STORE_RECIPES:
            return {
                ...state
            };
        default:
            return state;
    }
}
