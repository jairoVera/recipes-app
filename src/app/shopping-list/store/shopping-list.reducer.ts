import { Ingridient } from '../../shared/ingridient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingridients: Ingridient[];
    editedIngridient: Ingridient;
    editedIngridientIndex: number;
}

// Set up an initial state JS object
const initialState: State = {
    ingridients: [
        new Ingridient('Beef', 10),
        new Ingridient('Tortilla', 2)
    ],
    editedIngridient: null,
    editedIngridientIndex: -1
};

export function shoppingListReducer(
    state = initialState,
    action: ShoppingListActions.ShoppingListActions
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGRIDIENT:
            return  {
                ...state,   // copy old state
                ingridients: [...state.ingridients, action.payload] // but pass new state info
            }
        case ShoppingListActions.ADD_INGRIDIENTS:
            return {
                ...state,
                ingridients: [...state.ingridients, ...action.payload]
            }
        case ShoppingListActions.UPDATE_INGRIDIENT:
            const index = state.editedIngridientIndex;

            const ingridient = state.ingridients[index];

            const updatedIngridient = {
                ...ingridient,                  // Copy name/amount from old ingridient
                ...action.payload    // Override above with new ingridient name/amount
            };

            const updatedIngridients = [...state.ingridients];
            updatedIngridients[index] = updatedIngridient;

            return {
                ...state,
                ingridients: updatedIngridients,
                editedIngridientIndex: -1,
                editedIngridient: null
            };
        case ShoppingListActions.DELETE_INGRIDIENT:
            return {
                ...state,
                // array.filter returns a copy
                ingridients: state.ingridients.filter((ing, ingIndex) => {
                    return ingIndex !== state.editedIngridientIndex;
                }),
                editedIngridientIndex: -1,
                editedIngridient: null
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngridientIndex: action.payload,
                editedIngridient: { ...state.ingridients[action.payload] }  // creates new object
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngridient: null,
                editedIngridientIndex: -1
            };
        default:
            return state;
    }
}
