import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { InstitucionService } from '../../servicios/institucion-service';
import { Organizacion } from '../../clases/organizacion';

@Component({
  selector: 'macz-editar-organizaciones',
  templateUrl: '../organizacion.plantilla.html', //'./editar-organizaciones.component.html',
  styleUrls: ['./editar-organizaciones.component.scss']
})
export class EditarOrganizacionesComponent implements OnInit {

	private usuario:boolean;
	private _id:string;
	private organizacion:Organizacion;
	private nuevo:boolean;
	private regione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipiosSubject:BehaviorSubject<string | null>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private lista_niveles:string[];
	private lista_tipos:string[];

  constructor(private _service:InstitucionService, private _router:Router, private route:ActivatedRoute) { 
  	this.usuario = false;
  	this._id = this.route.snapshot.paramMap.get('id');
  	this.municipiosSubject = new BehaviorSubject(null);
  	this.nuevo = false;
  }

  ngOnInit() {
  	this.lista_niveles = ["regional","municipal","territorial","comunal"];
  	this.lista_tipos = ["gobierno","ong","privado"];
  	this.regione$ = this._service.GetRegiones();
  	this.municipio$ = this._service.GetMunicipiosPorRegion(this.municipiosSubject);
  	this._service.GetInstitucion(this._id).subscribe(instit => {
  		this.organizacion = new Organizacion(instit);
  	});
  }

  OnSelectRegion(){
  	let region:string = this.organizacion.region;
  	this.municipiosSubject.next(region);
  }

  OnGuardar(){
  	let that = this;
  	this._service.ActualizaInstitucion(this.organizacion,this._id).then(()=>{
  		this._router.navigateByUrl('/instituciones/ver/'.concat(that._id));
  	});
  }

}
