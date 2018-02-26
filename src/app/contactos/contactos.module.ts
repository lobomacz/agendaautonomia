import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactosComponent } from './contactos/contactos.component';
import { NavModule } from '../nav/nav.module';
import { NuevoComponent } from './nuevo/nuevo.component';
import { DetalleComponent } from './detalle/detalle.component';
import { EditarComponent } from './editar/editar.component';
import { EliminarComponent } from './eliminar/eliminar.component';


const routes:Routes = [
	{
		path: '',
		component: ContactosComponent
	},
  {
    path: 'nuevo',
    component: NuevoComponent
  },
  {
    path: 'detalle/:id',
    component: DetalleComponent
  },
  {
    path: 'editar/:id',
    component:EditarComponent
  },
  {
    path: 'eliminar/:id',
    component: EliminarComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavModule
  ],
  declarations: [ContactosComponent, NuevoComponent, DetalleComponent, EditarComponent, EliminarComponent]
})
export class ContactosModule { }
