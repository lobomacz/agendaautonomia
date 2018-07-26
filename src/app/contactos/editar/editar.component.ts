import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Funcionario } from '../../clases/funcionario';
import { Usuario } from '../../clases/usuario';
import { Mensaje } from '../../clases/mensaje';

import { AuthserviceService } from '../../servicios/authservice.service';
import { ContactoService } from '../../servicios/contacto-service';
import { InstitucionService } from '../../servicios/institucion-service';


@Component({
  selector: 'macz-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

	private usuario:any;
	private _id:string;
	private nuevo:boolean;
	private fotoFile:any;
	private fotoUrl:string;
	private nombreFoto:string;
	private funcionario?:Funcionario;
	private funcionarioGuardado:boolean;
	private usuarioFuncionario?:Usuario;
	private crearUsuario:boolean;
	private resetPassword:boolean;
	private contrasena:string;
	private confirmaContrasena:string;
	private usuarioGuardado:boolean;
	private organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;

	private mostrarDialogo:boolean;
	private mensajeDialogo:Mensaje;

  constructor(private _activeRoute:ActivatedRoute, private _auth:AuthserviceService, private _cService:ContactoService, private _iService:InstitucionService, private _router:Router) {
  	this._id = this._activeRoute.snapshot.paramMap.get('id');
  	this.nuevo = false;
  	this.fotoFile = null;
  	this.fotoUrl = 'assets/img/unknown-user.png';
  	this.nombreFoto = '';
  	this.funcionario = new Funcionario();
  	this.funcionarioGuardado = false;
  	this.usuarioFuncionario = null;
  	this.crearUsuario = false;
  	this.resetPassword = false;
  	this.usuarioGuardado = false;

  	this.mostrarDialogo = false;
  	this.mensajeDialogo = new Mensaje();
  }

  ngOnInit() {

  }

}
