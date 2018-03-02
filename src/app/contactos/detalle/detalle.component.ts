import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Funcionario } from '../../clases/funcionario';
import { Mensaje } from '../../clases/mensaje';

@Component({
  selector: 'macz-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

	private contacto:Funcionario;
	private contactoRef:AngularFireObject<any>;
	private contactoObservable:Observable<any>;
	private item:any;
  private mensaje:Mensaje;

	private _db:AngularFireDatabase;

	private dialogo_borrar:boolean = false;
  private dialogo_mensaje:boolean = false;

	private _router:Router;

  constructor(route:ActivatedRoute, db:AngularFireDatabase,router:Router) {
  	this._router = router;
  	this._db = db;
  	this.contactoRef = this._db.object('/contactos/'+route.snapshot.paramMap.get('id'));
  	this.contactoObservable = this.contactoRef.snapshotChanges();
    this.mensaje = new Mensaje();
  }

  ngOnInit() {
  	this.getFuncionario();
  }

  getFuncionario(){
  	this.contactoObservable.subscribe(contacto => {this.contacto = contacto.payload.val(); this.item = contacto});
  }

  OnEliminarClick(evento,id):void{

  	this.dialogo_borrar = true;

  	evento.preventDefault();
  }

  EliminarContacto(evento):void{
  	this.contactoRef.remove().then(function(){
      this._router.navigateByUrl('/contactos');
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
