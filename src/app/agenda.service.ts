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

  public GetContactosObservable(contactSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
  	return contactSubject.switchMap(instit => this._db.list('/contactos', ref => instit ? ref.orderByChild('organización').equalTo(instit) : ref).snapshotChanges());
  }

  public GetContactoObservable(_id:string):Observable<any>{
    return this._db.object('/contactos/'.concat(_id)).valueChanges();
  }

  public GetAllOrganizaciones():Observable<AngularFireAction<DatabaseSnapshot>[]>{
  	return this._db.list('/organizaciones').snapshotChanges();
  }

  public GetOrganizacionesPorTipo(organizacionesSub:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return organizacionesSub.switchMap(tipo_org => this._db.list('/organizaciones', ref => tipo_org ? ref.orderByChild('tipo').equalTo(tipo_org) : ref).snapshotChanges());
  }

  public GetOrganizacion(_id:string):Observable<any>{
    return this._db.object('/organizaciones/'+_id).valueChanges();
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

  public GetFotoContacto(nombre:string):Observable<string>{
    return this._storage.ref('/user_imgs/'.concat(nombre)).getDownloadURL();
  }

  public GuardaFotoContacto(nombre:string, archivo:any):Observable<string>{
    //this._storage.ref('/user_imgs/').putString(nombre);
    let ref = this._storage.ref('/user_imgs/'+nombre);

    return ref.put(archivo).downloadURL();
  }

  public UpdateFotoContact(anterior:string, nuevo:string, archivo:any):Observable<string>{
    this._storage.ref('/user_imgs/'.concat(anterior)).delete();
    return this.GuardaFotoContacto(nuevo,archivo);
  }

  public BorraImagen(imagenUrl:string){
    this._storage.ref(imagenUrl).delete();
  }

  public GuardaContacto(clave:string, funcionario:Funcionario):any{
    return this._db.object('/contactos/'.concat(clave)).set(funcionario.ToJSon());
    //return this._db.ref('/contactos/'.concat(clave)).set()
  }

  public ActualizaContacto(clave:string, funcionario:Funcionario):any{
    return this._db.object('/contactos/'.concat(clave)).update(funcionario.ToJSon());
  }

  public EliminaContacto(clave:string):any{
    return this._db.object('/contactos/'.concat(clave)).remove();
  }

}
