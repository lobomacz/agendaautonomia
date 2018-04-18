import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizacionesComponent } from './organizaciones/organizaciones.component';
import { SharedModule } from '../shared/shared.module';

const routes:Routes = [
	{
		path: '',
		component: OrganizacionesComponent
	}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ],
  declarations: [OrganizacionesComponent]
})
export class OrganizacionesModule { }
