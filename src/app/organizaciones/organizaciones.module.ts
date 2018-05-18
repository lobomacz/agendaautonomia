import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizacionesComponent } from './organizaciones/organizaciones.component';
import { SharedModule } from '../shared/shared.module';
import { VerOrganizacionesComponent } from './ver-organizaciones/ver-organizaciones.component';
import { EditarOrganizacionesComponent } from './editar-organizaciones/editar-organizaciones.component';

const routes:Routes = [
  {
    path: 'ver/:id',
    component:VerOrganizacionesComponent
  },
  {
    path: 'ver',
    component: VerOrganizacionesComponent
  },
  {
    path: 'editar/:id',

  },
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
  declarations: [
  OrganizacionesComponent, 
  VerOrganizacionesComponent,
  EditarOrganizacionesComponent
  ]
})
export class OrganizacionesModule { }
