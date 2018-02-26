import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentosComponent } from './documentos/documentos.component';

const routes:Routes = [
	{
		path: '',
		component: DocumentosComponent
	}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocumentosComponent]
})
export class DocumentosModule { }
