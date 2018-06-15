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
	private institucionesSub:BehaviorSubject<string | null>;
	private institucione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private sectore$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private personalProyecto:any;


  constructor(private _service:ProyectosService, private _institService:InstitucionService) { 
  	this.nuevo = true;
  	this.usuario = false;
  	this.proyecto = new Proyecto();
  	this.tipoProyecto = "gobierno";
  	this.personalProyecto = {"f":0,"m":0,"mestizo":0,"miskitu":0,"creole":0,"garifuna":0,"ulwa":0,"rama":0};
  }

  ngOnInit() {
  	this.institucionesSub = new BehaviorSubject(this.tipoProyecto);
  	this.institucione$ = this._institService.GetInstitucionesPorTipo(this.institucionesSub);
  	this.sectore$ = this._service.GetSectores();
  }

  setTipoProyecto(tipo:string):void{
  	this.tipoProyecto = tipo;
  	this.institucionesSub.next(this.tipoProyecto);
  }

}
