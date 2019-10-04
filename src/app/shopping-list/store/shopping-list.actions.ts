import { Action } from '@ngrx/store';
import { Ingridient } from 'src/app/shared/ingridient.model';

export const ADD_INGRIDIENT = 'ADD_INGRIDIENT';
export const ADD_INGRIDIENTS = 'ADD_INGRIDIENTS';
export const UPDATE_INGRIDIENT = 'UPDATE_INGRIDIENT';
export const DELETE_INGRIDIENT = 'DELETE_INGRIDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

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
