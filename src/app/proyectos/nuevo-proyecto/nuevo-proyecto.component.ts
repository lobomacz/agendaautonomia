import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';

import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';

import { Proyecto } from '../../clases/proyecto';
import { PersonalProyecto } from '../../clases/personal-proyecto';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'macz-nuevo-proyecto',
  templateUrl: '../proyectos.plantilla.html',//'./nuevo-proyecto.component.html',
  styleUrls: ['./nuevo-proyecto.component.scss']
})
export class NuevoProyectoComponent implements OnInit {

	private usuario:any;
	private nuevo:boolean;
	private tipoProyecto:string;
	private proyecto:Proyecto;
  private personalProyecto:any;
	private organizacionesSub:BehaviorSubject<string | null>;
	private organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private sectore$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private comunidadesSub:BehaviorSubject<string | null>;
	private comunidade$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private municipioUbicacion:string;
  private comunidadUbicacion:string;
  private min_fecha_inicio:any;
  private min_fecha_final:any;
  private listaSitios:any[];
  private listaNombreSitios:string[];


  constructor(private _service:ProyectosService, private _institService:InstitucionService, private _router:Router) { 
  	this.nuevo = true;
  	this.proyecto = new Proyecto();
    this.personalProyecto = new PersonalProyecto();
  	this.tipoProyecto = "publico";
    this.min_fecha_inicio = new Date();
    this.min_fecha_final = new Date().setMonth(this.min_fecha_inicio.getMonth()+3);
    this.listaSitios = [];
    this.listaNombreSitios = [];
  }

  ngOnInit() {
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
      console.log(this.comunidade$);
  	}else{
  		this.comunidadesSub.next(this.municipioUbicacion);
  	}
  }

  OnGuardar_Listener(){
    let that = this;
  	this.proyecto.tipo = this.tipoProyecto;

    if(this.proyecto.tipo == "publico"){
      this.proyecto.monto = this.proyecto.cooperacion + this.proyecto.tesoro;
    }
    
    this._service.IngresaProyecto(this.proyecto).then((clave) => {
      this._service.IngresaSitiosProyecto(clave.toString(),this.listaSitios);
      this._router.navigateByUrl('/proyectos');
    });
  }

  
  OnAgregarUbicacion_Listener(){
    let ubicacion:any = {};
    let nombre:string = '';
    ubicacion.municipio = this.municipioUbicacion;
    ubicacion.comunidad = this.comunidadUbicacion;

    this.listaSitios.push(ubicacion);

    nombre = this.municipioUbicacion;

    this._service.GetComunidad(this.comunidadUbicacion).subscribe((comu) => {
      nombre = nombre.concat('-',comu.nombre);
      this.listaNombreSitios.push(nombre);
    });
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

}
