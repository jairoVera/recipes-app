import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ShoppingListService } from '../shopping-list.service';
import { Ingridient } from '../../shared/ingridient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingridient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppingListService.getIngridientByIndex(this.editedItemIndex);

      this.form.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    });
  }

  onSubmit() {
    const formValue = this.form.value;
    const newIngridient = new Ingridient(formValue.name, formValue.amount);

    if (this.editMode) {
      this.shoppingListService.updateIngridient(this.editedItemIndex, newIngridient);
    } else {
      this.shoppingListService.addIngridient(newIngridient);
    }

    this.onClear();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.editedItemIndex = -1;
    this.editedItem = null;
  }

  onDelete() {
    this.shoppingListService.deleteIngridient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
