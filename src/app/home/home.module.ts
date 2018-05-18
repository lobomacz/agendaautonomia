import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';


const routes: Routes = [
	{
		path:'contactos',
		redirectTo: '/contactos',
		pathMatch: 'full'
	},
	{
		path:'programas',
		redirectTo: '/programas',
		pathMatch: 'full'
	},
	{
		path: 'documentos',
		redirectTo: '/documentos',
		pathMatch: 'full'
	},
	{
		path: '',
		component: HomeComponent
	}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
	HomeComponent, 
	]
})
export class HomeModule { }
