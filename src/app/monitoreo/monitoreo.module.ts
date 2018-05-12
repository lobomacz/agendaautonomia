import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MonitoreoComponent } from './monitoreo/monitoreo.component';

const rutas:Routes = [
	{
		path: '',
		component: MonitoreoComponent
	}
];

@NgModule({
  imports: [
  	RouterModule.forChild(rutas),
    CommonModule
  ],
  declarations: [MonitoreoComponent]
})
export class MonitoreoModule { }
