import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from '../../servicios/authservice.service';
import { Organizacion } from '../../clases/organizacion';

@Component({
  selector: 'macz-editar-organizaciones',
  templateUrl: '../organizacion.plantilla.html', //'./editar-organizaciones.component.html',
  styleUrls: ['./editar-organizaciones.component.scss']
})
export class EditarOrganizacionesComponent implements OnInit {

	public usuarioId:string;
	public organizacion:Organizacion;
	public nuevo:boolean;
	//private regione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	//private municipiosSubject:BehaviorSubject<string | null>;
	public municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	public lista_niveles:string[];
	public lista_tipos:string[];

  private _id:string;

  constructor(private _service:InstitucionService, private _router:Router, private route:ActivatedRoute, private _auth:AuthserviceService) { 
  	this._id = this.route.snapshot.paramMap.get('id');
  	//this.municipiosSubject = new BehaviorSubject(null);
  	this.nuevo = false;
    this.organizacion = new Organizacion();
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;

    if(this.usuarioId === null){
      this.Redirect('/error');
    }else{
      this._auth.IsAdmin(this.usuarioId).subscribe((v) => {
        if(v.key === null){
          this.Redirect('/error');
        }
      });
    }

  	this.lista_niveles = ["regional","municipal","territorial","comunal"];
  	this.lista_tipos = ["publico","alcaldia","ong","privado"];
  	//this.regione$ = this._service.GetRegiones();
  	this.municipio$ = this._service.GetMunicipios(); //this._service.GetMunicipiosPorRegion(this.municipiosSubject);
  	this._service.GetInstitucion(this._id).subscribe(instit => {
  		this.organizacion = new Organizacion(instit);
  	});
  }

  /*
  OnSelectRegion(){
  	let region:string = this.organizacion.region;
  	this.municipiosSubject.next(region);
  }*/

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta);
  }

  OnGuardar(){
  	let that = this;
  	this._service.ActualizaInstitucion(this.organizacion,this._id).then(()=>{
  		this._router.navigateByUrl('/instituciones/ver/'.concat(that._id));
  	});
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home');
  }

}
