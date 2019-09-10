import { Ingridient } from '../shared/ingridient.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

    private ingridients: Ingridient[] = [
        new Ingridient('Beef', 10),
        new Ingridient('Tortilla', 2)
    ];

    updateShoppingList = new Subject<Ingridient[]>();
    startedEditing = new Subject<number>();

    getIngridients() {
        return this.ingridients.slice();
    }

    getIngridientByIndex(index: number) {
        if (index >= 0 && index < this.ingridients.length) {
            return this.getIngridients()[index];
        } else {
            return null;
        }
    }

    addIngridient(ingridient: Ingridient) {
        this.ingridients.push(ingridient);
        this.updateShoppingList.next(this.getIngridients());
    }

    updateIngridient(index: number, ingridient: Ingridient) {
        this.ingridients[index] = ingridient;
        this.updateShoppingList.next(this.getIngridients());
    }

    deleteIngridient(index: number) {
        this.ingridients.splice(index, 1);
        this.updateShoppingList.next(this.getIngridients());
    }

    addIngridients(ingridients: Ingridient[]) {
        this.ingridients.push(...ingridients);
        this.updateShoppingList.next(this.getIngridients());
    }
}
