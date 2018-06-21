import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { InstitucionService } from "../../servicios/institucion-service";

@Component({
  selector: 'macz-organizaciones',
  templateUrl: './organizaciones.component.html',
  styleUrls: ['./organizaciones.component.scss']
})
export class OrganizacionesComponent implements OnInit {


	public usuario:any;
	public tipo_filtro:string;
  private organizacionesSub:BehaviorSubject<string | null>;
	private organizaciones$:Observable<AngularFireAction<DatabaseSnapshot>[]>;


  constructor(private _service:InstitucionService) {
  	this.tipo_filtro = 'todas';
  }

  ngOnInit() {
    this.organizacionesSub = new BehaviorSubject(null);
    this.organizaciones$ = this._service.GetInstitucionesPorTipo(this.organizacionesSub);
  }

  setTipoFiltro(tipo:string):void{
  	this.tipo_filtro = tipo;

  	if (this.tipo_filtro != 'todas') {
  		this.organizacionesSub.next(this.tipo_filtro);
  	}else{
  		this.organizacionesSub.next(null);
  	}
  }

}
