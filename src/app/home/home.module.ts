import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NavModule } from '../nav/nav.module';
import { HomeComponent } from './home.component';


const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
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
	}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavModule
  ],
  declarations: [
	HomeComponent, 
	]
})
export class HomeModule { }
