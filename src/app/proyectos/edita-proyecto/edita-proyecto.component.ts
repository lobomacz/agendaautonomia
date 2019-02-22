import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Proyecto } from '../../clases/proyecto';
import { PersonalProyecto } from '../../clases/personal-proyecto';
import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from "../../servicios/authservice.service";


@Component({
  selector: 'macz-edita-proyecto',
  templateUrl: '../proyectos.plantilla.html', //'./edita-proyecto.component.html',
  styleUrls: ['./edita-proyecto.component.scss']
})
export class EditaProyectoComponent implements OnInit {

	private usuarioId:string;
	private nuevo:boolean;
  private disableUbicacion:boolean;
	private _id:string;
  private anio:number;
	private tipoProyecto:string;
	private proyecto:Proyecto;
  private personal:PersonalProyecto;
	private organizacionesSub:BehaviorSubject<string | null>;
	private organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private sectore$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private comunidadesSub:BehaviorSubject<string | null>;
	private comunidade$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipioUbicacion:string;
	private comunidadUbicacion:string;
	private min_fecha_inicio:any;
	private min_fecha_final:any;
	private listaSitios:any[];
	private listaNombreSitios:string[];


  constructor(private _activatedRoute:ActivatedRoute, private _router:Router, private _service:ProyectosService, private _institService:InstitucionService, private _auth:AuthserviceService) {
  	this.nuevo = false;
    this.disableUbicacion = true;
  	this._id = this._activatedRoute.snapshot.paramMap.get('id');
    this.anio = Number.parseInt(this._activatedRoute.snapshot.paramMap.get('anio'));
  	this.tipoProyecto = "publico";
  	this.proyecto = new Proyecto();
    this.personal = new PersonalProyecto();
    this.listaSitios = null;
    this.listaNombreSitios = [];
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
    
  	this._service.GetProyecto(this._id, this.anio.toString()).subscribe(datos => {
  		this.proyecto = new Proyecto(datos);
      console.log(this.proyecto.fechaInicio);
      this._service.GetPersonalProyecto(this._id, this.anio.toString()).subscribe(datos => {
        this.personal = new PersonalProyecto(datos);
      });
  		this.min_fecha_inicio = this.proyecto.fechaInicio;
  		this.min_fecha_final = this.proyecto.fechaFinal;
  		this.tipoProyecto = this.proyecto.tipo;
  		this.organizacionesSub = new BehaviorSubject(this.tipoProyecto);
  		this.organizacione$ = this._institService.GetInstitucionesPorTipo(this.organizacionesSub);
  		this.sectore$ = this._service.GetSectores();
  		this.municipio$ = this._service.GetMunicipios();
  		this.comunidadesSub = new BehaviorSubject(null);
  		this.comunidade$ = this._service.GetComunidadesPorMunicipio(this.comunidadesSub);
      this._service.GetSitiosProyecto(this._id, this.anio.toString()).subscribe((sitios) => {

        if (sitios !== null) {
          this.listaSitios = sitios;
          for(let sitio of this.listaSitios){
            let nombre:string = '';
            this._service.GetComunidad(sitio.comunidad).subscribe((comu) => {
              nombre = sitio.municipio.concat(' - ', comu.nombre);
              this.listaNombreSitios.push(nombre);
            });
          }
        }
        
      });
  	});
  }

  OnMunicipio_Select(){
  	this.comunidadesSub.next(this.municipioUbicacion);
  }

  OnComunidad_Select(){
    this.disableUbicacion = false;
  }

  setTipoProyecto(tipo:string):void{
  	this.tipoProyecto = tipo;
  	this.organizacionesSub.next(this.tipoProyecto);
  }

  OnGuardar_Listener(){
  	let that = this;

  	if(this.proyecto.tipo !== this.tipoProyecto){
  		this.proyecto.tipo = this.tipoProyecto;
  	}

  	if(this.proyecto.tipo === "publico" || this.proyecto.tipo === "alcaldia"){
  		this.proyecto.monto = this.proyecto.cooperacion + this.proyecto.tesoro;
  	}

  	this._service.ActualizaProyecto(this.proyecto, this._id).then(() => {
      that._service.ActualizaSitiosProyecto(that._id,that.listaSitios,this.anio.toString());
      that._service.ActualizaPersonalProyecto(that._id,that.personal,this.anio.toString());
  		that._router.navigateByUrl('/proyectos/ver/'.concat(that._id));
  	});
  }

  OnAgregarUbicacion_Listener(){

    if (this.listaSitios === null) {
      this.listaSitios = [];
    }

    if (this.municipioUbicacion !== null && this.comunidadUbicacion !== null) {
      let ubicacion:any = {};
      let nombre:string = '';
      ubicacion.municipio = this.municipioUbicacion;
      ubicacion.comunidad = this.comunidadUbicacion;

      this.listaSitios.push(ubicacion);

      nombre = this.municipioUbicacion;

      this._service.GetComunidad(this.comunidadUbicacion).subscribe((comu) => {
        nombre = nombre.concat('-',comu.nombre);
        this.listaNombreSitios.push(nombre);
        this.municipioUbicacion = null;
        this.comunidadUbicacion = null;
        this.disableUbicacion = true;
      });
    }

    
  }

  BorraSitio(indice:number){
    if(indice == this.listaSitios.length - 1){
      this.listaSitios.pop();
      this.listaNombreSitios.pop();
    }else if(indice === 0){
      this.listaSitios.shift();
      this.listaNombreSitios.shift();
    }else{
      this.listaSitios.splice(indice,1);
      this.listaNombreSitios.splice(indice,1);
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
