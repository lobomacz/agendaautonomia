import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Proyecto } from '../../clases/proyecto';
import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';


@Component({
  selector: 'macz-edita-proyecto',
  templateUrl: '../proyectos.plantilla.html', //'./edita-proyecto.component.html',
  styleUrls: ['./edita-proyecto.component.scss']
})
export class EditaProyectoComponent implements OnInit {

	private usuario:boolean;
	private nuevo:boolean;
	private _id:string;
	private tipoProyecto:string;
	private proyecto:Proyecto;
	private organizacionesSub:BehaviorSubject<string | null>;
	private organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private sectore$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private comunidadesSub:BehaviorSubject<string | null>;
	private comunidade$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private min_fecha_inicio:any;
	private min_fecha_final:any;


  constructor(private _activatedRoute:ActivatedRoute, private _router:Router, private _service:ProyectosService, private _institService:InstitucionService) {
  	this.usuario = false;
  	this.nuevo = false;
  	this._id = this._activatedRoute.snapshot.paramMap.get('id');
  	this.tipoProyecto = "gobierno";
  	this.proyecto = new Proyecto();
  }

  ngOnInit() {
  	this._service.GetProyecto(this._id).subscribe(datos => {
  		this.proyecto = new Proyecto(datos);
  		this.min_fecha_inicio = this.proyecto.fechaInicio;
  		this.min_fecha_final = this.proyecto.fechaFinal;
  		this.tipoProyecto = this.proyecto.tipo;
  		this.organizacionesSub = new BehaviorSubject(this.tipoProyecto);
  		this.organizacione$ = this._institService.GetInstitucionesPorTipo(this.organizacionesSub);
  		this.sectore$ = this._service.GetSectores();
  		this.municipio$ = this._service.GetMunicipios();
  		this.comunidadesSub = new BehaviorSubject(null);
  		this.comunidade$ = this._service.GetComunidadesPorMunicipio(this.comunidadesSub);
  	});
  }

  OnMunicipio_Select(){
  	this.comunidadesSub.next(this.proyecto.municipio);
  }

  OnGuardar_Listener(){
  	let that = this;
  	this._service.ActualizaProyecto(this.proyecto, this._id).then(() => {
  		that._router.navigateByUrl('/proyectos/ver/'.concat(that._id));
  	});
  }

}
