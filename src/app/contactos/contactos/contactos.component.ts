import { Component, OnInit } from '@angular/core';
import { OpcionNav } from '../../clases/opcion-nav';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AgendaService } from "../../agenda.service";


@Component({
  selector: 'macz-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent implements OnInit {

	private menuNav:Array<OpcionNav>;

  private contactos:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private contactosSubject: BehaviorSubject<string | null>;

  private organizaciones:Observable<any[]>;

  constructor( private _service:AgendaService ) {

  	this.menuNav = new Array<OpcionNav>();
  	this.menuNav.push({
  		titulo:'Ajustes',
  		icono:'',
  		ruta:'ajustes'
  	});
  	this.menuNav.push({titulo:'salir',icono:'',ruta:'salir'});
    
    this.contactosSubject = new BehaviorSubject(null);
    this.contactos = this._service.GetContactoObservable(this.contactosSubject);
    /*this._db = db;
    this.instituciones = new BehaviorSubject(null);
    this.contactos = this.instituciones.switchMap(instit => db.list('/contactos', ref => instit ? ref.orderByChild('organización').equalTo(instit) : ref).snapshotChanges());*/
    this.organizaciones = this._service.GetAllOrganizaciones();
    //this.contactos = this._db.list('/contactos').valueChanges();
    //this.contactos.subscribe(value => console.log(value));
  }

  suscribeMunicipios(municipio:string | null):any{
    
  }

  ngOnInit() {
  }

}
