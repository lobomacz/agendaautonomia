import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { SharedModule } from './../shared/shared.module';


const routes:Routes = [
	{
		path: '',
		component: ProyectosComponent
	}
];

@NgModule({
  imports: [
  	RouterModule.forChild(routes),
    CommonModule,
    SharedModule
  ],
  declarations: [ProyectosComponent]
})
export class ProyectosModule { }
