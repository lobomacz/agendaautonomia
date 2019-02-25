import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { ContactoService } from '../../servicios/contacto-service';
import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from '../../servicios/authservice.service';

import { Funcionario } from '../../clases/funcionario';
import { Organizacion } from '../../clases/organizacion';
import { Mensaje } from '../../clases/mensaje';

@Component({
  selector: 'macz-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  public _id:string;
  public usuarioId:string;
  public contacto:Funcionario;
  public organizacion:Organizacion;
  public foto:string;
  public dialogo_borrar:boolean = false;
  public dialogo_mensaje:boolean = false;
  public mensaje:Mensaje;

  private esAdmin:boolean;
	private contactoObservable:Observable<any>;
  private organizacion$:Observable<any>;
  private foto$:Observable<string>;
  

	


  constructor(private _route:ActivatedRoute, private _service:ContactoService, private _institService:InstitucionService, private _router:Router, private _auth:AuthserviceService) {
    this._id = this._route.snapshot.paramMap.get('id');
    this.contacto = new Funcionario();
    this.mensaje = new Mensaje();
    this.organizacion = new Organizacion();
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

  	this.getFuncionario();
  }

  getFuncionario(){
    this.contactoObservable = this._service.GetContactoObservable(this._id);
  	this.contactoObservable.subscribe(contacto => {
      this.contacto = new Funcionario(contacto);
      this.organizacion$ = this._institService.GetInstitucion(this.contacto.organizacion);
      this.organizacion$.subscribe(org => {this.organizacion = new Organizacion(org)});
      if(this.contacto.foto.indexOf("assets") < 0){
        this.foto$ = this._service.GetFotoContacto(this._id, this.contacto.foto);
        this.foto$.subscribe(imgUrl => {this.foto = imgUrl});
      }else{
        this.foto = this.contacto.foto;
      }
      
    });
    
  }

  OnEliminarClick(evento):void{

  	this.dialogo_borrar = true;

  	evento.preventDefault();
  }

  OnEliminarContacto(evento):void{

    let that = this;

    if(this.contacto.foto.indexOf("assets")<0){
      let ruta:string = "/user_imgs/" + this.contacto.foto;
      this._service.BorraImagen(ruta);
    }

  	this._service.EliminaContacto(this._id).then(function(){
      that._router.navigateByUrl('/contactos');
    }).catch(err => {
      this.mensaje.titulo = "Error al eliminar registro.";
      this.mensaje.mensaje = "La operación sufrió un error al intentar eliminar el registro. Error: "+err;
      this.mensaje.tipo = Mensaje.T_MENSAJE.T_ERROR;
      this.dialogo_mensaje = true;
    });

    evento.preventDefault();

  }

  CerrarModal(evento):void{
    this.dialogo_borrar = false;
    evento.preventDefault();
  }

  CerrarDialogo(evento):void{
    this.dialogo_mensaje = false;
    this.mensaje = new Mensaje();
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
