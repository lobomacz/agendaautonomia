import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Proyecto } from '../../clases/proyecto';
import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';

@Component({
  selector: 'macz-detalle-proyecto',
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.scss']
})
export class DetalleProyectoComponent implements OnInit {

	private usuario:boolean;
	private _id:string;
	private organizacion:string;
	private sector:string;
	private municipio:string;
	private comunidad:string;
	private proyect0:Observable<any>;
	private proyecto:Proyecto;
	private dialogo_borrar:boolean;


  constructor(private _activatedRoute:ActivatedRoute, private _router:Router, private _service:ProyectosService, private _institService:InstitucionService) {
  	this.usuario = false;
  	this.dialogo_borrar = false;
  	this._id = this._activatedRoute.snapshot.paramMap.get('id');
  	this.proyect0 = this._service.GetProyecto(this._id);
  }

  ngOnInit() {
  	this.proyect0.subscribe(datos => {
  		this.proyecto = new Proyecto(datos);

  		this._institService.GetInstitucion(this.proyecto.idOrganizacion).subscribe(instituc => {
  			this.organizacion = instituc.nombre_corto;
  		});

  		this._service.GetSectores().subscribe(sectores => {
  			this.sector = sectores[this.proyecto.sector].payload.val();
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
  	this._service.BorraProyecto(this._id);
  	this._router.navigateByUrl('/proyectos');
  }

  CerrarModal(evento:Event){
  	this.dialogo_borrar = false;
  	evento.preventDefault();
  }

}
