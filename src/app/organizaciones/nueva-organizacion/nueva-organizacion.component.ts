import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';

import { InstitucionService } from '../../servicios/institucion-service';
import { Organizacion } from '../../clases/organizacion';
import { Funcionario } from '../../clases/funcionario';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'macz-nueva-organizacion',
  templateUrl: '../organizacion.plantilla.html',//'./nueva-organizacion.component.html',
  styleUrls: ['./nueva-organizacion.component.scss']
})
export class NuevaOrganizacionComponent implements OnInit {

	private usuario:boolean;
	private organizacion:Organizacion;
	private regione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipiosSubject:BehaviorSubject<string | null>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private lista_niveles:string[];
	private lista_tipos:string[];
	private nuevo:boolean;
	private guardado:boolean;

  constructor(private _service:InstitucionService, private _router:Router) {
  	this.nuevo = true;
  	this.municipiosSubject = new BehaviorSubject(null);
  	this.usuario = false;
  }

  ngOnInit() {
  	this.lista_niveles = ["regional","municipal","territorial","comunal"];
  	this.lista_tipos = ["gobierno","ong","privado"];
  	this.regione$ = this._service.GetRegiones();
  	this.municipio$ = this._service.GetMunicipiosPorRegion(this.municipiosSubject);
  	this.organizacion = new Organizacion();
  }

  OnSelectRegion(){
  	let region:string = this.organizacion.region;
  	this.municipiosSubject.next(region);
  }

  OnGuardar(){
    let that = this;
  	this._service.GuardaInstitucion(this.organizacion).then(()=>{
      that.Redirect();
    });
  }

  Redirect(){
    this._router.navigateByUrl("/instituciones")
  }

}
