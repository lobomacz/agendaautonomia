import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AgendaService } from "../../agenda.service";

@Component({
  selector: 'macz-organizaciones',
  templateUrl: './organizaciones.component.html',
  styleUrls: ['./organizaciones.component.scss']
})
export class OrganizacionesComponent implements OnInit {


	public usuario:any;
	public tipo_filtro:string;
	private organizaciones$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private organizacionesSub:BehaviorSubject<string | null>;


  constructor(private _service:AgendaService) {
  	this.organizacionesSub = new BehaviorSubject(null);
  	this.tipo_filtro = 'todas';
  }

  ngOnInit() {
    this.organizaciones$ = this._service.GetOrganizacionesPorTipo(this.organizacionesSub);
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
