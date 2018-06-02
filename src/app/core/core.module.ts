import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
	{
		path: 'login',
		loadChildren: './../login/login.module#LoginModule'
	},
	{
		path: 'home',
		loadChildren:'./../home/home.module#HomeModule'
	},
	{
		path: 'contactos',
		loadChildren: './../contactos/contactos.module#ContactosModule'
	},
	{
		path: 'monitoreo',
		loadChildren: './../monitoreo/monitoreo.module#MonitoreoModule'
	},
	{
		path: 'proyectos',
		loadChildren: './../proyectos/proyectos.module#ProyectosModule'
	},
	{
		path: 'documentos',
		loadChildren: './../documentos/documentos.module#DocumentosModule'
	},
	{
		path: 'instituciones',
		loadChildren: './../organizaciones/organizaciones.module#OrganizacionesModule'
	},
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{
		path:'**',
		component: PageNotFoundComponent
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [ShellComponent, PageNotFoundComponent],
  exports: [
  	ShellComponent
  ]
})
export class CoreModule { }
