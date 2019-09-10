import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';

import { ShoppingListService } from './shopping-list.service';
import { Ingridient } from '../shared/ingridient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingridients: Ingridient[] = [];
  private igChangeSub: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingridients = this.shoppingListService.getIngridients();
    this.igChangeSub = this.shoppingListService.updateShoppingList.subscribe(
      (ingridients: Ingridient[]) => {
        this.ingridients = ingridients;
    });
  }

  onIngridientAdded(ingridient: Ingridient) {
    this.ingridients.push(ingridient);
  }

  onClickItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

  ngOnDestroy() {
    this.igChangeSub.unsubscribe();
  }
}
