import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactosComponent } from './contactos/contactos.component';
import { SharedModule } from '../shared/shared.module';
import { NuevoComponent } from './nuevo/nuevo.component';
import { DetalleComponent } from './detalle/detalle.component';
import { EditarComponent } from './editar/editar.component';


const routes:Routes = [
  {
    path: 'ver/:id',
    component: DetalleComponent
  },
  {
    path: 'editar/:id',
    component: EditarComponent
  },
  {
    path: 'nuevo',
    component: NuevoComponent
  },
  {
    path: '',
    component: ContactosComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ],
  declarations: [ContactosComponent, NuevoComponent, DetalleComponent, EditarComponent]
})
export class ContactosModule { }
