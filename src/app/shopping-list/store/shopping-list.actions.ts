import { Action } from '@ngrx/store';
import { Ingridient } from 'src/app/shared/ingridient.model';

export const ADD_INGRIDIENT    = '[Shopping List] Add Ingredient';
export const ADD_INGRIDIENTS   = '[Shopping List] Add Ingredients';
export const UPDATE_INGRIDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGRIDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT        = '[Shopping List] Start Edit';
export const STOP_EDIT         = '[Shopping List] Stop Edit';

export class AddIngridient implements Action {
    constructor(public payload: Ingridient) {}

    /**
     * Action properties
     */
    readonly type = ADD_INGRIDIENT;
}

export class AddIngridients implements Action {
    constructor(public payload: Ingridient[]) {}

    readonly type = ADD_INGRIDIENTS;
}

export class UpdateIngridient implements Action {
    constructor(public payload: Ingridient) {}

    readonly type = UPDATE_INGRIDIENT;
}

export class DeleteIngridient implements Action {
    readonly type = DELETE_INGRIDIENT;
}

export class StartEdit implements Action {
    readonly type = START_EDIT;

    constructor(public payload: number) {}
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}

export type ShoppingListActions =
    AddIngridient |
    AddIngridients |
    UpdateIngridient |
    DeleteIngridient |
    StartEdit |
    StopEdit;
