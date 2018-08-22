import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MonitoreoComponent } from './monitoreo/monitoreo.component';
import { SharedModule } from '../shared/shared.module';
import { ReporteComponent } from './reporte/reporte.component';

const rutas:Routes = [
	{
		path: '',
		component: MonitoreoComponent
	}
];

@NgModule({
  imports: [
  	RouterModule.forChild(rutas),
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [MonitoreoComponent, ReporteComponent]
})
export class MonitoreoModule { }
