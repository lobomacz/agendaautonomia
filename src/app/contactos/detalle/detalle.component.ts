import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { ContactoService } from '../../servicios/contacto-service';
import { Funcionario } from '../../clases/funcionario';
import { Mensaje } from '../../clases/mensaje';

@Component({
  selector: 'macz-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  private _id:string;
  private usuario:any;
	private contacto:Funcionario;
	private contactoObservable:Observable<any>;
  private foto$:Observable<string>;
  private foto:string;
  private mensaje:Mensaje;

	private dialogo_borrar:boolean = false;
  private dialogo_mensaje:boolean = false;


  constructor(private _route:ActivatedRoute, private _service:ContactoService, private _router:Router) {
    this._id = this._route.snapshot.paramMap.get('id');
  	this.contactoObservable = this._service.GetContactoObservable(this._id);
    this.contacto = new Funcionario();
    this.mensaje = new Mensaje();
  }

  ngOnInit() {
  	this.getFuncionario();
  }

  getFuncionario(){
  	this.contactoObservable.subscribe(contacto => {
      this.contacto.Populate(contacto);
      if(this.contacto.foto.indexOf("assets") < 0){
        this.foto$ = this._service.GetFotoContacto(this.contacto.foto);
        this.foto$.subscribe(imgUrl => this.foto = imgUrl);
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

}
