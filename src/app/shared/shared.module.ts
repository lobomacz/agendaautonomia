import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DialogComponent } from './dialog/dialog.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NavComponent, NavBarComponent, DialogComponent],
  exports: [NavComponent, NavBarComponent, DialogComponent]
})
export class SharedModule { }
