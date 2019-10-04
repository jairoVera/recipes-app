import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingridient } from '../shared/ingridient.model';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as shoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingridients: Observable<{ ingridients: Ingridient[] }>;

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit() {
    this.ingridients = this.store.select('shoppingList');
  }

  onIngridientAdded(ingridient: Ingridient) {
    this.ingridients.push(ingridient);
  }

  onClickItem(index: number) {
    this.store.dispatch(new shoppingListActions.StartEdit(index));
  }
}
