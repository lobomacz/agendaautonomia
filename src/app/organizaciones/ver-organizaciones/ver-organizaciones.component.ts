import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from "../../servicios/authservice.service";
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'macz-ver-organizaciones',
  templateUrl: './ver-organizaciones.component.html',
  styleUrls: ['./ver-organizaciones.component.scss']
})
export class VerOrganizacionesComponent implements OnInit {

  public usuarioId:string;
  public esAdmin:boolean;
	public _id:string;
	public organizacion:any;
  public dialogo_borrar:boolean;
  public dialogo_mensaje:boolean;

  private organizacion$:Observable<any>;

  constructor(private activatedRoute:ActivatedRoute, private _router:Router, private _service:InstitucionService, private _auth:AuthserviceService) { 
  	this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this.dialogo_borrar = false;
    this.dialogo_mensaje = false;
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
      that.Redirect('/instituciones');
    });

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
