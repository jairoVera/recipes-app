import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Ingridient } from '../../shared/ingridient.model';
import { Subscription } from 'rxjs';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) form: NgForm;
  shopListSub: Subscription;
  editMode = false;
  editedItem: Ingridient;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.shopListSub = this.store.select('shoppingList').subscribe(stateData => {
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
      this.store.dispatch(new ShoppingListActions.UpdateIngridient(newIngridient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngridient(newIngridient));
    }

    this.onClear();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.editedItem = null;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngridient());
    this.onClear();
  }

  ngOnDestroy() {
    if (this.shopListSub) {
      this.shopListSub.unsubscribe();
    }
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
