import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';

import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AuthserviceService } from '../../servicios/authservice.service';
import { InstitucionService } from '../../servicios/institucion-service';

@Component({
  selector: 'macz-transmuni',
  templateUrl: './transmuni.component.html',
  styleUrls: ['./transmuni.component.scss']
})
export class TransmuniComponent implements OnInit {

	private usuarioId:string;
	private annio:number;
	private codAlcaldia:string;
	private cooperacionExterna:number;
	private tesoroNacional:number;
	private nuevo:boolean;
	private dialogo_borrar:boolean;

	private alcaldias:AngularFireAction<DatabaseSnapshot>[];
	private transferencias:AngularFireAction<DatabaseSnapshot>[];

	@ViewChild('formTransmuni') formulario:any; 

  constructor(private _auth:AuthserviceService, private _iService:InstitucionService, private _router:Router) { 
  	this.annio = new Date().getFullYear();
  	this.codAlcaldia = '';
  	this.nuevo = true;
  	this.dialogo_borrar = false;
  }

  ngOnInit() {

  	this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;
    if(this.usuarioId === null){
      this.Redirect('/error');
    }

    this._iService.GetAlcaldias().subscribe((datos) => {
  		this.alcaldias = datos;
  		this._iService.GetTransferenciasPip(this.annio).subscribe((trans) => {
	  		this.transferencias = trans;  		
	  	});
  	});

  	
  }

  Ingresar():void{
  	let that = this;
  	if(this.nuevo){
  		this._iService.IngresaTransferenciaPip(this.annio,this.codAlcaldia,this.cooperacionExterna,this.tesoroNacional).then(() => {
	  		that.LimpiaCampos();
	  	}).catch(() => {});
  	}else{
  		this.Actualizar();
  	}
  	
  }

  LlenaTransferencias(){
  	this.LimpiaCampos();
  	this._iService.GetTransferenciasPip(this.annio).subscribe((trans) => {
  		this.transferencias = trans;
  	});
  }

  Actualizar(){
  	let that = this;
  	this._iService.UpdateTransferenciaPip(this.annio,this.codAlcaldia,this.cooperacionExterna,this.tesoroNacional).then(() => {
  		that.LimpiaCampos();
  	});
  }

  Borrar(id:string){
  	this.codAlcaldia = id;
  	this.dialogo_borrar = true;
  }

  LimpiaCampos(){
  	this.codAlcaldia = '';
  	this.nuevo = true;
  	this.cooperacionExterna = null;
  	this.tesoroNacional = null;
  	//this.formulario.nativeElement.reset();
  }

  CheckAlcaldia(){
  	let enlista:boolean = false;
  	this.transferencias.forEach((t)=>{
  		if(t.key === this.codAlcaldia) {
  			enlista = true;
  		}
  	});

  	return enlista;

  }

  Editar(id:string){
  	
  	this._iService.GetTransferenciaPip(this.annio,id).subscribe((t) => {
  		console.log({'id':id,'dato':t});
  		this.nuevo = false;
  		this.codAlcaldia = t.key;
  		this.cooperacionExterna = t.payload.val().cext;
  		this.tesoroNacional = t.payload.val().tesoro;
  	});
  }

  GetAlcaldia(key:string):AngularFireAction<DatabaseSnapshot>{
  	let alcaldia:AngularFireAction<DatabaseSnapshot> = null;
  	this.alcaldias.forEach((v) => {
  		if(v.key === key){
  			alcaldia = v;
  		}
  	});

  	return alcaldia;
  }

  OnEliminarTrans_Click(evento:Event){
  	let that = this;
  	this._iService.DeleteTransferenciaPip(this.annio,this.codAlcaldia).then(() => {
  		that.LimpiaCampos();
  	});
  }

  CerrarModal(evento:Event){
  	this.dialogo_borrar = false;
  	evento.preventDefault();
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home');
  }

}
