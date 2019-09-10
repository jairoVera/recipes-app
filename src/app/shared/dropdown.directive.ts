import { Directive, ElementRef, HostListener, Renderer2, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  // Bind this.class.isOpen to open class.
  // Toggling this.class.isOpen toggles the open class
  @HostBinding('class.open') isOpen = false;

  constructor() { }

  @HostListener('click') click() {
    this.isOpen = !this.isOpen;
  }
}
