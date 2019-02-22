import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { SharedModule } from './../shared/shared.module';
import { NuevoProyectoComponent } from './nuevo-proyecto/nuevo-proyecto.component';
import { EditaProyectoComponent } from './edita-proyecto/edita-proyecto.component';
import { DetalleProyectoComponent } from './detalle-proyecto/detalle-proyecto.component';


const routes:Routes = [
	{
		path: '',
		component: ProyectosComponent
	},
  {
    path: 'ver/:anio/:id',
    component: DetalleProyectoComponent
  },
  {
    path: 'nuevo',
    component: NuevoProyectoComponent
  },
  {
    path: 'editar/:anio/:id',
    component: EditaProyectoComponent
  }
];

@NgModule({
  imports: [
  	RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [ProyectosComponent, NuevoProyectoComponent, EditaProyectoComponent, DetalleProyectoComponent]
})
export class ProyectosModule { }
