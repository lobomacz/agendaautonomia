import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';

import { SharedModule } from '../shared/shared.module';



const routes: Routes = [
	{
		path:'',
		component: LoginComponent
	},
  {
    path:'home',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
