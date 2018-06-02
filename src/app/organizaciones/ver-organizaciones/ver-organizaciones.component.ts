import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AgendaService } from '../../agenda.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'macz-ver-organizaciones',
  templateUrl: './ver-organizaciones.component.html',
  styleUrls: ['./ver-organizaciones.component.scss']
})
export class VerOrganizacionesComponent implements OnInit {

  private usuario:any;
	private _id:string;
	private organizacion$:Observable<any>;
	private organizacion:any;
  private dialogo_borrar:boolean;
  private dialogo_mensaje:boolean;

  constructor(private activatedRoute:ActivatedRoute, private _router:Router, private _service:AgendaService) { 
  	this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this.dialogo_borrar = false;
    this.dialogo_mensaje = false;
  }

  ngOnInit() {
  	this.organizacion$ = this._service.GetInstitucion(this._id);
  	this.organizacion$.subscribe(item => {this.organizacion = item});
  }

  CerrarModal(evento:Event){
    this.dialogo_borrar = false;
    evento.preventDefault();
  }

  OnEliminar_Click(evento:Event){
    this.dialogo_borrar = true;
    evento.preventDefault();
  }

  OnEliminarInstitucion(evento:Event){
    let that = this;
    this._service.EliminaInstitucion(this._id).then(()=>{
      that._router.navigateByUrl("/instituciones");
    });

    evento.preventDefault();
  }

}
