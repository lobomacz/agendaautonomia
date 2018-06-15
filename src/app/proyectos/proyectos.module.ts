import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { SharedModule } from './../shared/shared.module';
import { NuevoProyectoComponent } from './nuevo-proyecto/nuevo-proyecto.component';


const routes:Routes = [
	{
		path: '',
		component: ProyectosComponent
	},
  {
    path: 'nuevo',
    component: NuevoProyectoComponent
  }
];

@NgModule({
  imports: [
  	RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [ProyectosComponent, NuevoProyectoComponent]
})
export class ProyectosModule { }
