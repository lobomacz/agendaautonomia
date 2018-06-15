import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';

@Component({
  selector: 'macz-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

	private usuario:boolean;
	private opcionFiltro:string;
	private filtro:string;
	private aniosSubject:BehaviorSubject<string | null>;
	private sectorSubject:BehaviorSubject<string>;
	private institucionSubject:BehaviorSubject<string>;
	private proyecto_anio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private proyecto_sector$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private proyecto_institucion$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private listaProyectos:AngularFireAction<DatabaseSnapshot>[];
	private listaOpciones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private listaSectores:AngularFireAction<DatabaseSnapshot>[];


  constructor(private _service:ProyectosService, private _institService:InstitucionService) {
  	this.usuario = false;
  	this.opcionFiltro = 'todos';
  	this.aniosSubject = new BehaviorSubject(null);
  }

  ngOnInit() {
  	this.aniosSubject = new BehaviorSubject(null);
  	this.proyecto_anio$ = this._service.GetProyectosPorAnio(this.aniosSubject);
  	this.LlenaLista();
  	this._service.GetSectores().subscribe(lista => {
  		this.listaSectores = lista;
  	});
  }

  LlenaLista(){

  	switch (this.opcionFiltro) {
  		case "sector":
  			this.proyecto_sector$.subscribe(lista => this.listaProyectos = lista);
  			break;
  		case "institucion":
  			this.proyecto_institucion$.subscribe(lista => this.listaProyectos = lista);
  			break;
  		default:
  			this.proyecto_anio$.subscribe(lista => {
		  		this.listaProyectos = lista;
		  	});
  			break;
  	}

  }

  GetListaSectores(){
  	this.listaOpciones = this._service.GetSectores();
  }

  GetListaInstituciones(){
  	this.listaOpciones = this._institService.GetInstituciones();
  }

  setTipoFiltro(opcion:string){
  	this.opcionFiltro = opcion;

  	switch (this.opcionFiltro) {
  		case "sector":
  			this.GetListaSectores();
  			break;
  		case "institucion":
  			this.GetListaInstituciones();
  			break;
  	}
  }

  UpdateLista(){
  	switch (this.opcionFiltro) {
  		case "anio":
  			this.aniosSubject.next(this.filtro);
  			break;
  		case "sector":
  			if(this.sectorSubject == null){
  				this.sectorSubject = new BehaviorSubject(this.filtro);
  				this.proyecto_sector$ = this._service.GetProyectosPorSector(this.sectorSubject);
  			}else{
  				this.sectorSubject.next(this.filtro);
  			}
  			break;
  		case "institucion":
  			if(this.institucionSubject == null){
  				this.institucionSubject = new BehaviorSubject(this.filtro);
  				this.proyecto_institucion$ = this._service.GetProyectosPorInstitucion(this.institucionSubject);
  			}else{
  				this.institucionSubject.next(this.filtro);
  			}
  			break;
  		default:
  			this.aniosSubject.next(null);
  			break;
  	}

  	this.LlenaLista();
  }

}
