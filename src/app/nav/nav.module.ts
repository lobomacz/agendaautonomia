import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NavComponent],
  exports: [NavComponent]
})
export class NavModule { }
