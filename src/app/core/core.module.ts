import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';


const routes: Routes = [
	{
		path: '',
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
		path: 'programas',
		loadChildren: './../programas/programas.module#ProgramasModule'
	},
	{
		path: 'documentos',
		loadChildren: './../documentos/documentos.module#DocumentosModule'
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [ShellComponent],
  exports: [
  	ShellComponent
  ]
})
export class CoreModule { }
