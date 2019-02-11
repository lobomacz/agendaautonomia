import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TransmuniComponent } from './transmuni/transmuni.component';
import { SharedModule } from '../shared/shared.module';


const routes:Routes = [
	{
		path: '',
		component: TransmuniComponent
	}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule
  ],
  declarations: [TransmuniComponent]
})
export class TransferenciasModule { }
