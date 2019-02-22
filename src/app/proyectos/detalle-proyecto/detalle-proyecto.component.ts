import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Proyecto } from '../../clases/proyecto';
import { PersonalProyecto } from '../../clases/personal-proyecto';
import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from "../../servicios/authservice.service";

@Component({
  selector: 'macz-detalle-proyecto',
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.scss']
})
export class DetalleProyectoComponent implements OnInit {

	private usuarioId:string;
  private esAdmin:boolean;
	private _id:string;
  private anio:number;
	private organizacion:string;
	private sector:string;
	private municipio:string;
	private comunidad:string;
	private proyect0:Observable<any>;
	private proyecto:Proyecto;
	private dialogo_borrar:boolean;
  private listaSitios:string[];
  private personal:PersonalProyecto;


  constructor(private _activatedRoute:ActivatedRoute, private _router:Router, private _service:ProyectosService, private _institService:InstitucionService, private _auth:AuthserviceService) {
  	this.dialogo_borrar = false;
  	this._id = this._activatedRoute.snapshot.paramMap.get('id');
    this.anio = Number.parseInt(this._activatedRoute.snapshot.paramMap.get('anio'));
  	this.proyect0 = this._service.GetProyecto(this._id, this.anio.toString());
    this.listaSitios = [];
    this.esAdmin = false;
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;

    if(this.usuarioId === null){
      this.Redirect('/error');
    }

    this._auth.IsAdmin(this.usuarioId).subscribe((v) => {
      if(v.key !== null){
        this.esAdmin = true;
      }
    });
    
  	this.proyect0.subscribe(datos => {
  		this.proyecto = new Proyecto(datos);

  		this._institService.GetInstitucion(this.proyecto.id_organizacion).subscribe(instituc => {
  			this.organizacion = instituc.nombre_corto;
  		});

  		this._service.GetSectores().subscribe(sectores => {
  			this.sector = sectores[this.proyecto.sector].payload.val();
  		});

      this._service.GetSitiosProyecto(this._id, this.anio.toString()).subscribe((datos) => {
        for(let sitio of datos){
          let nombre:string = '';
          this._service.GetComunidad(sitio.comunidad).subscribe((comu) => {
            nombre = sitio.municipio.concat(' - ',comu.nombre);
            this.listaSitios.push(nombre);
          });
        }
      });

      this._service.GetPersonalProyecto(this._id, this.anio.toString()).subscribe((personal) => {
        this.personal = new PersonalProyecto(personal);
      });
      /*
  		this._service.GetMunicipio(this.proyecto.municipio).subscribe(muni => {
  			this.municipio = muni.nombre;
  		});

  		this._service.GetComunidad(this.proyecto.comunidad).subscribe(comun => {
  			this.comunidad = comun.nombre;
  		});*/

  	});
  }

  OnEliminar_Click(evento:Event){
  	this.dialogo_borrar = true;
  	evento.preventDefault();
  }

  OnEliminarProyecto_Click(evento:Event){
    let that = this;
  	this._service.BorraProyecto(this._id, this.anio.toString()).then(() => {
      that._service.BorraPersonalProyecto(that._id, this.anio.toString());
      that._service.BorraSitiosProyecto(that._id, this.anio.toString());
      that._router.navigateByUrl('/proyectos');
    });
    evento.preventDefault();
  }

  CerrarModal(evento:Event){
  	this.dialogo_borrar = false;
  	evento.preventDefault();
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home')
  }

}
