import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Proyecto } from '../../clases/proyecto';
import { PersonalProyecto } from '../../clases/personal-proyecto';
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
  private listaSitios:string[];
  private personal:PersonalProyecto;


  constructor(private _activatedRoute:ActivatedRoute, private _router:Router, private _service:ProyectosService, private _institService:InstitucionService) {
  	this.usuario = false;
  	this.dialogo_borrar = false;
  	this._id = this._activatedRoute.snapshot.paramMap.get('id');
  	this.proyect0 = this._service.GetProyecto(this._id);
    this.listaSitios = [];
  }

  ngOnInit() {
  	this.proyect0.subscribe(datos => {
  		this.proyecto = new Proyecto(datos);

  		this._institService.GetInstitucion(this.proyecto.id_organizacion).subscribe(instituc => {
  			this.organizacion = instituc.nombre_corto;
  		});

  		this._service.GetSectores().subscribe(sectores => {
  			this.sector = sectores[this.proyecto.sector].payload.val();
  		});

      this._service.GetSitiosProyecto(this._id).subscribe((datos) => {
        for(let sitio of datos){
          let nombre:string = '';
          this._service.GetComunidad(sitio.comunidad).subscribe((comu) => {
            nombre = sitio.municipio.concat(' - ',comu.nombre);
            this.listaSitios.push(nombre);
          });
        }
      });

      this._service.GetPersonalProyecto(this._id).subscribe((personal) => {
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
  	this._service.BorraProyecto(this._id).then(() => {
      that._service.BorraPersonalProyecto(that._id);
      that._service.BorraSitiosProyecto(that._id);
      that._router.navigateByUrl('/proyectos');
    });
    evento.preventDefault();
  }

  CerrarModal(evento:Event){
  	this.dialogo_borrar = false;
  	evento.preventDefault();
  }

}
