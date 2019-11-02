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
        default:
            return state;
    }
}
