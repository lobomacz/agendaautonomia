import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransmuniComponent } from './transmuni/transmuni.component';


const routes:Routes = [
	{
		path: '',
		component: TransmuniComponent
	}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransmuniComponent]
})
export class TransferenciasModule { }
