import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DialogComponent } from './dialog/dialog.component';
import { PagerComponent } from './pager/pager.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NavComponent, NavBarComponent, DialogComponent, PagerComponent],
  exports: [NavComponent, NavBarComponent, DialogComponent, PagerComponent]
})
export class SharedModule { }
