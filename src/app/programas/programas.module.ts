import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgramasComponent } from './programas/programas.component';

const routes:Routes = [
	{
		path: '',
		component: ProgramasComponent
	}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProgramasComponent]
})
export class ProgramasModule { }
