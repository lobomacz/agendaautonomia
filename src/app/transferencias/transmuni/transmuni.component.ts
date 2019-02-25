import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';

import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthserviceService } from '../../servicios/authservice.service';
import { InstitucionService } from '../../servicios/institucion-service';
import { ProyectosService } from '../../servicios/proyectos-service';


@Component({
  selector: 'macz-transmuni',
  templateUrl: './transmuni.component.html',
  styleUrls: ['./transmuni.component.scss']
})
export class TransmuniComponent implements OnInit {

	public usuarioId:string;
	public annio:number;
	public codAlcaldia:string;
	public cooperacionExterna:number;
	public tesoroNacional:number;
	public nuevo:boolean;
	public dialogo_borrar:boolean;
  public showDialog:boolean;
  public titulo_dialogo:string;
  public texto_dialogo:string;
  public alcaldias:AngularFireAction<DatabaseSnapshot>[];
  public transferencias:AngularFireAction<DatabaseSnapshot>[];

  private annio_abierto:number;
  private alcaldias_con_proyectos:string[];

	@ViewChild('formTransmuni') formulario:any; 
  @ViewChild('btnGuardar') btnGuardar:any;

  constructor(
    private _auth:AuthserviceService, 
    private _iService:InstitucionService, 
    private pService:ProyectosService, 
    private _router:Router
    ) { 
  	this.annio = new Date().getFullYear();
    this.annio_abierto = this.annio;
  	this.codAlcaldia = '';
    this.cooperacionExterna = null;
    this.tesoroNacional = null;
  	this.nuevo = true;
  	this.dialogo_borrar = false;
    this.showDialog = false;
    this.titulo_dialogo = '';
    this.texto_dialogo = '';
    this.alcaldias_con_proyectos = [];
  }

  ngOnInit() {

  	this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;
    if(this.usuarioId === null){
      this.Redirect('/error');
    }

    this._iService.GetAlcaldias().subscribe((datos) => {
  		this.alcaldias = datos;

      this.LlenaAlcaldiasConProyectos();


  		this._iService.GetTransferenciasPip(this.annio).subscribe((trans) => {
	  		this.transferencias = trans;  		
        this.LlenaTransferencias();
	  	});
  	});

  	
  }

  Ingresar():void{
  	
    if(this.CheckAnnio('ingresar')) {
      let that = this;
      if(this.nuevo){
        console.log({'cooperacion':this.cooperacionExterna,'tesoro':this.tesoroNacional});
        this._iService.IngresaTransferenciaPip(this.annio,this.codAlcaldia,this.cooperacionExterna,this.tesoroNacional).then(() => {
          that.LimpiaCampos();
        }, (rejected) => {
          console.log(rejected);
        }).catch((error) => {
          console.log(error.message);
        });
      }else{
        this.Actualizar();
      }
    }
  	
  }

  LlenaAlcaldiasConProyectos(){
      this.pService.GetProyectosPorAnio(new BehaviorSubject(this.annio)).subscribe((proyectos) => {
        proyectos.forEach((v) => {
          this.alcaldias.forEach((a) => {
            if(a.key === v.payload.val().id_organizacion) {
              if(this.alcaldias_con_proyectos.indexOf(a.key) < 0) {
                this.alcaldias_con_proyectos.push(a.key);
              }
            }
          });
        });
      });
  }

  LlenaTransferencias(){
  	//this.LimpiaCampos();
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
  	if(this.CheckAnnio('eliminar')) {
      this.codAlcaldia = id;
      this.dialogo_borrar = true;
    }
  }

  LimpiaCampos(){
  	//this.codAlcaldia = '';
  	this.nuevo = true;
  	//this.cooperacionExterna = null;
  	//this.tesoroNacional = null;
    this.formulario.reset();
  }

  CheckAlcaldia(){
  	let enlista:boolean = false;

    if(!this.CheckAnnio('ingresar') && (this.transferencias == undefined || this.transferencias.length == 0)){
      this.titulo_dialogo = 'Sin Datos de Transferencias';
      this.texto_dialogo = 'No hay datos en la lista de transferencias. Ingrese un año válido y presione buscar para actualizar la lista.';
      this.showDialog = true;
      return enlista;
    }

    if(this.alcaldias_con_proyectos.indexOf(this.codAlcaldia) >= 0) {
      //La alcaldía tiene proyectos registrados. No puede registrar transferencia para esta alcaldía.
      this.titulo_dialogo = 'Alcaldía con Proyectos';
      this.texto_dialogo = `La alcaldía tiene proyectos registrados. No puede registrar transferencia para esta alcaldía.`;
      this.showDialog = true;
      enlista = true;
    }else{
      this.transferencias.forEach((t)=>{
        if(t.key === this.codAlcaldia) {
          enlista = true;
          this.titulo_dialogo = 'Alcaldía en Lista';
          this.texto_dialogo = `La alcaldía tiene transferencia registrada. No puede registrar más transferencias para esta alcaldía.`;
          this.showDialog = true;
        }
      });
    }
  	

  	return enlista;

  }


  CheckAnnio(accion:string):boolean{
    let abierto = false;
    if(this.annio != this.annio_abierto){
      this.titulo_dialogo = 'Año Cerrado';
      this.texto_dialogo = `El año seleccionado ya fué cerrado. No se pueden ${accion} transferencias para el año ${this.annio}`;
      this.showDialog = true;
    }else{
      abierto = true;
    }

    return abierto;
  }

  Editar(id:string){
  	
  	if(this.CheckAnnio('editar')) {
      this._iService.GetTransferenciaPip(this.annio,id).subscribe((t) => {
      
        this.nuevo = false;
        this.codAlcaldia = t.key;
        this.cooperacionExterna = t.payload.val().cext;
        this.tesoroNacional = t.payload.val().tesoro;
      });
    }
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

  CierraDialogo(){
    this.showDialog = false;
    this.titulo_dialogo = '';
    this.texto_dialogo = '';
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home');
  }

}
