import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import * as firebase from 'firebase/app';


@Injectable()
export class AgendaService {

	protected _db:AngularFireDatabase;
	protected _storage:AngularFireStorage;
	protected _auth:AngularFireAuth;

  constructor(db:AngularFireDatabase,storage:AngularFireStorage,auth:AngularFireAuth) {
  	this._db = db;
  	this._storage = storage;
  	this._auth = auth;
  }

  public GetDb():AngularFireDatabase{
    return this._db;
  }

  public GetRegiones():Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return this._db.list('/regiones').snapshotChanges();
  }

  public GetMunicipiosPorRegion(municipioSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return municipioSubject.switchMap(reg => this._db.list('/municipios', ref => reg ? ref.orderByChild('region').equalTo(reg) : ref).snapshotChanges());
  }

  public AuthUser():Observable<any>{

  	return this._auth.authState;
  	
  }
  
}
