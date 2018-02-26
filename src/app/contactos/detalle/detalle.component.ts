import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Funcionario } from '../../clases/funcionario';

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
	private _db:AngularFireDatabase;
	private dialogo_borrar:boolean = false;

	private _router:Router;

  constructor(route:ActivatedRoute, db:AngularFireDatabase,router:Router) {
  	this._router = router;
  	this._db = db;
  	this.contactoRef = this._db.object('/contactos/'+route.snapshot.paramMap.get('id'));
  	this.contactoObservable = this.contactoRef.snapshotChanges();
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
  	this.contactoRef.remove();

    this._router.navigateByUrl('/contactos');
    evento.preventDefault();

  }

  CerrarModal(evento):void{
    this.dialogo_borrar = false;
    evento.preventDefault();
  }

}
