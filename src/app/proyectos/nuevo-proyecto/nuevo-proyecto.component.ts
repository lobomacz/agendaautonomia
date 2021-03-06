import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';

import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from "../../servicios/authservice.service";

import { Proyecto } from '../../clases/proyecto';
import { PersonalProyecto } from '../../clases/personal-proyecto';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'macz-nuevo-proyecto',
  templateUrl: '../proyectos.plantilla.html',//'./nuevo-proyecto.component.html',
  styleUrls: ['./nuevo-proyecto.component.scss']
})
export class NuevoProyectoComponent implements OnInit {

	public usuarioId:string;
	public nuevo:boolean;
  public disableUbicacion:boolean;
	public tipoProyecto:string;
	public proyecto:Proyecto;
  public personal:PersonalProyecto;
	public organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	public sectore$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	public municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	public comunidade$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  public municipioUbicacion:string;
  public comunidadUbicacion:string;
  public min_fecha_inicio:any;
  public min_fecha_final:any;
  public listaSitios:any[];
  public listaNombreSitios:string[];

  private organizacionesSub:BehaviorSubject<string | null>;
  private comunidadesSub:BehaviorSubject<string | null>;


  constructor(private _service:ProyectosService, private _institService:InstitucionService, private _router:Router, private _auth:AuthserviceService) { 
  	this.nuevo = true;
    this.disableUbicacion = true;
  	this.proyecto = new Proyecto();
    this.personal = new PersonalProyecto();
    this.proyecto.anio = new Date().getFullYear();
  	this.tipoProyecto = "publico";
    this.min_fecha_inicio = new Date();
    this.min_fecha_final = new Date().setMonth(this.min_fecha_inicio.getMonth()+3);
    this.listaSitios = null;
    this.listaNombreSitios = [];
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;

    if(this.usuarioId === null){
      this.Redirect('/error');
    }else{
      this._auth.IsAdmin(this.usuarioId).subscribe((v) => {
        if(v.key === null){
          this.Redirect('/error');
        }
      });
    }
    
  	this.organizacionesSub = new BehaviorSubject(this.tipoProyecto);
  	this.organizacione$ = this._institService.GetInstitucionesPorTipo(this.organizacionesSub);
  	this.sectore$ = this._service.GetSectores();
  	this.municipio$ = this._service.GetMunicipios();
  }

  setTipoProyecto(tipo:string):void{
  	this.tipoProyecto = tipo;
  	this.organizacionesSub.next(this.tipoProyecto);
  }

  OnMunicipio_Select(){
  	if(this.comunidadesSub == null){
	  	this.comunidadesSub = new BehaviorSubject(this.municipioUbicacion);
	  	this.comunidade$ = this._service.GetComunidadesPorMunicipio(this.comunidadesSub);
  	}else{
  		this.comunidadesSub.next(this.municipioUbicacion);
  	}
  }

  OnComunidad_Select(){
    this.disableUbicacion = false;
  }

  OnGuardar_Listener(){
    let that = this;
  	this.proyecto.tipo = this.tipoProyecto;

    if(this.proyecto.tipo === "publico" || this.proyecto.tipo === "alcaldia"){
      this.proyecto.monto = this.proyecto.cooperacion + this.proyecto.tesoro;
    }
    
    this._service.IngresaProyecto(this.proyecto).then((ref) => {
      let clave = ref.key;
      this._service.IngresaSitiosProyecto(clave, this.listaSitios, this.proyecto.anio.toString());
      this._service.IngresaPersonalProyecto(clave, this.personal, this.proyecto.anio.toString());
      this._router.navigateByUrl('/proyectos');
    });
  }

  
  OnAgregarUbicacion_Listener(){
    if (this.listaSitios === null) {
      this.listaSitios = [];
    }

    if(this.municipioUbicacion !== null && this.comunidadUbicacion !== null){
      let ubicacion:any = {};
      let nombre:string = '';
      ubicacion.municipio = this.municipioUbicacion;
      ubicacion.comunidad = this.comunidadUbicacion;

      this.listaSitios.push(ubicacion);

      nombre = this.municipioUbicacion;

      this._service.GetComunidad(this.comunidadUbicacion).subscribe((comu) => {
        nombre = nombre.concat(' - ',comu.nombre);
        this.listaNombreSitios.push(nombre);
        this.municipioUbicacion = null;
        this.comunidadUbicacion = null;
        this.disableUbicacion = true;
      });
    }
    
  }

  BorraSitio(indice:number){
    if(indice == this.listaSitios.length - 1){
      this.listaSitios.pop();
      this.listaNombreSitios.pop();
    }else if(indice === 0){
      this.listaSitios.shift();
      this.listaNombreSitios.shift();
    }else{
      this.listaSitios.splice(indice,1);
      this.listaNombreSitios.splice(indice,1);
    }
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home')
  }

}
