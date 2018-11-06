import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { InstitucionService } from "../../servicios/institucion-service";
import { AuthserviceService } from "../../servicios/authservice.service";

@Component({
  selector: 'macz-organizaciones',
  templateUrl: './organizaciones.component.html',
  styleUrls: ['./organizaciones.component.scss']
})
export class OrganizacionesComponent implements OnInit {

	private usuarioId:string;
  private esAdmin:boolean;
	public tipo_filtro:string;
  private organizacionesSub:BehaviorSubject<string | null>;
	private organizaciones$:Observable<AngularFireAction<DatabaseSnapshot>[]>;


  constructor(private _router:Router , private _service:InstitucionService, private _auth:AuthserviceService) {
  	this.tipo_filtro = 'todas';
    this.esAdmin = false;
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;

    if(this.usuarioId === null){
      this.Redirect('/error');
    }

    this._auth.IsAdmin(this.usuarioId).subscribe((v) => {
      if (v.key !== null) {
        this.esAdmin = true;
      }
    });

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

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home')
  }

}
