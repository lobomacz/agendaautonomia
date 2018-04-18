import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { DialogComponent } from './dialog/dialog.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NavComponent, DialogComponent, NavBarComponent],
  exports: [NavComponent, DialogComponent, NavBarComponent]
})
export class SharedModule { }
