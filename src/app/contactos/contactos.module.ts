import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactosComponent } from './contactos/contactos.component';
import { SharedModule } from '../shared/shared.module';
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
    FormsModule,
    SharedModule
  ],
  declarations: [ContactosComponent, NuevoComponent, DetalleComponent, EditarComponent, EliminarComponent]
})
export class ContactosModule { }
