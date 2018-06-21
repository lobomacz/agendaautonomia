import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';

import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';

import { Proyecto } from '../../clases/proyecto';

@Component({
  selector: 'macz-nuevo-proyecto',
  templateUrl: '../proyectos.plantilla.html',//'./nuevo-proyecto.component.html',
  styleUrls: ['./nuevo-proyecto.component.scss']
})
export class NuevoProyectoComponent implements OnInit {

	private usuario:boolean;
	private nuevo:boolean;
	private tipoProyecto:string;
	private proyecto:Proyecto;
	private organizacionesSub:BehaviorSubject<string | null>;
	private organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private sectore$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private comunidadesSub:BehaviorSubject<string | null>;
	private comunidade$:Observable<AngularFireAction<DatabaseSnapshot>[]>;


  constructor(private _service:ProyectosService, private _institService:InstitucionService, private _router:Router) { 
  	this.nuevo = true;
  	this.usuario = false;
  	this.proyecto = new Proyecto();
  	this.tipoProyecto = "gobierno";
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
	  	this.comunidadesSub = new BehaviorSubject(this.proyecto.municipio);
	  	this.comunidade$ = this._service.GetComunidadesPorMunicipio(this.comunidadesSub);
  	}else{
  		this.comunidadesSub.next(this.proyecto.municipio);
  	}
  }

  OnGuardar_Listener(){
  	this.proyecto.tipo = this.tipoProyecto;
    this._service.IngresaProyecto(this.proyecto).then(()=>this._router.navigateByUrl('/proyectos'));
  }

}
