import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import * as firebase from 'firebase/app';

import { Funcionario } from './clases/funcionario';
import { Organizacion } from './clases/organizacion';

@Injectable()
export class AgendaService {

	private _db:AngularFireDatabase;
	private _storage:AngularFireStorage;
	private _auth:AngularFireAuth;

  constructor(db:AngularFireDatabase,storage:AngularFireStorage,auth:AngularFireAuth) {
  	this._db = db;
  	this._storage = storage;
  	this._auth = auth;
  }

  public GetContactoObservable(contactSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
  	return contactSubject.switchMap(instit => this._db.list('/contactos', ref => instit ? ref.orderByChild('organización').equalTo(instit) : ref).snapshotChanges());
  }

  public GetAllOrganizaciones():Observable<any[]>{
  	return this._db.list('/organizaciones').valueChanges();
  }

  public AuthUser():Observable<any>{

  	return this._auth.authState;
  	
  }

}
