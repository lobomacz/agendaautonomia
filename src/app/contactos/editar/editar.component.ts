import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Funcionario } from '../../clases/funcionario';
import { Mensaje } from '../../clases/mensaje';

@Component({
  selector: 'macz-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

	private _id:string;
	private _db:AngularFireDatabase;
	private funcionarioRef:AngularFireObject<any>;
	private funcionarioObs:Observable<any>;
  private organizaciones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private funcionario:Funcionario;
	private mensaje:Mensaje;
	private dialogo_mensaje:boolean;
	private _router:Router;
  private usuario:any;

  constructor(db:AngularFireDatabase,router:Router,route:ActivatedRoute) {
  	this._db = db;
  	this._id = route.snapshot.paramMap.get('id');
    //this.funcionario = new Funcionario();
  	this.funcionarioRef = this._db.object('/contactos/'+this._id);
  	this.funcionarioObs = this.funcionarioRef.valueChanges();
  	this._router = router;
  	this.dialogo_mensaje = false;
  	this.mensaje = new Mensaje();
  }

  ngOnInit() {
  	this.funcionarioObs.subscribe(item => {this.funcionario = item}, err => {
      this.mensaje.titulo = "Error al recuperar datos.";
      this.mensaje.mensaje = "No se recuperaron datos del contacto. Error: "+err;
      this.mensaje.tipo = Mensaje.T_MENSAJE.T_ERROR;
      this.dialogo_mensaje = true;
    });

    this.getOrganizaciones();
  }

  getOrganizaciones():void{
    this.organizaciones = this._db.list('/organizaciones/').snapshotChanges();
  }

  ActualizarContacto():void{
  	
  }

  CerrarDialogo(evento){
  	this.dialogo_mensaje = false;
  	this.mensaje = new Mensaje();

  	evento.preventDefault();
  }

}
