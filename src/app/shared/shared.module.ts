import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { DialogComponent } from './dialog/dialog.component';
import { OverlayComponent } from './overlay/overlay.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NavComponent, DialogComponent, OverlayComponent],
  exports: [NavComponent, DialogComponent, OverlayComponent]
})
export class SharedModule { }
