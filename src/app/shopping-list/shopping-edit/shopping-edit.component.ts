import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Ingridient } from '../../shared/ingridient.model';
import { Subscription } from 'rxjs';
import * as shoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingridient;

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngridientIndex !== -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngridient;

        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
        this.editedItem = null;
      }
    });
  }

  onSubmit() {
    const formValue = this.form.value;
    const newIngridient = new Ingridient(formValue.name, formValue.amount);

    if (this.editMode) {
      this.store.dispatch(new shoppingListActions.UpdateIngridient(newIngridient));
    } else {
      this.store.dispatch(new shoppingListActions.AddIngridient(newIngridient));
    }

    this.onClear();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.editedItem = null;
    this.store.dispatch(new shoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new shoppingListActions.DeleteIngridient());
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new shoppingListActions.StopEdit());
  }
}
