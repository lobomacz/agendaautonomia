import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
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

  public GetDb():AngularFireDatabase{
    return this._db;
  }

  public GetContactosObservable(contactSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
  	return contactSubject.switchMap(instit => this._db.list('/contactos', ref => instit ? ref.orderByChild('organización').equalTo(instit) : ref).snapshotChanges());
  }

  public GetContactoObservable(_id:string):Observable<any>{
    return this._db.object('/contactos/'.concat(_id)).valueChanges();
  }

  public GuardaContacto(clave:string, funcionario:Funcionario):any{
    let item = funcionario.ToJSon();
    return this._db.object('/contactos/'.concat(clave)).set(item);
    //return this._db.ref('/contactos/'.concat(clave)).set()
  }

  public ActualizaContacto(clave:string, funcionario:Funcionario):any{
    return this._db.object('/contactos/'.concat(clave)).update(funcionario.ToJSon());
  }

  public EliminaContacto(clave:string):Promise<void>{
    return this._db.object("/contactos/".concat(clave)).remove();
  }

  public GetFotoContacto(nombre:string):Observable<string>{
    return this._storage.ref('/user_imgs/'.concat(nombre)).getDownloadURL();
  }

  public GuardaFotoContacto(nombre:string, archivo:any):Observable<string>{
    
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

  public GetInstituciones():Observable<AngularFireAction<DatabaseSnapshot>[]>{
  	return this._db.list('/organizaciones').snapshotChanges();
  }

  public GetInstitucionesPorTipo(organizacionesSub:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return organizacionesSub.switchMap(tipo_org => this._db.list('/organizaciones', ref => tipo_org ? ref.orderByChild('tipo').equalTo(tipo_org) : ref).snapshotChanges());
  }

  public GetInstitucion(_id:string):Observable<any>{
    return this._db.object('/organizaciones/'+_id).valueChanges();
  }

  public GuardaInstitucion(item:Organizacion, clave:string){
    return this._db.object("/organizaciones/".concat(clave.toLowerCase())).set(item.ToJSon());
  }

  public ActualizaInstitucion(item:Organizacion, clave:string){
    return this._db.object("/organizaciones/".concat(clave)).update(item.ToJSon());
  }

  public EliminaInstitucion(clave:string):Promise<void>{
    return this._db.object("/organizaciones/".concat(clave)).remove();
  }

  public GetRegiones():Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return this._db.list('/regiones').snapshotChanges();
  }

  public GetMunicipiosPorRegion(municipioSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return municipioSubject.switchMap(reg => this._db.list('/municipios', ref => reg ? ref.orderByChild('region').equalTo(reg) : ref).snapshotChanges());
  }

  public GetProyectosPorAnio(proyectosAnio:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return proyectosAnio.switchMap(anio => this._db.list('/proyectos', ref => anio ? ref.orderByChild('anio').equalTo(anio) : ref).snapshotChanges());
    //return this._db.list('/proyectos', ref => ref.orderByChild('anio')).snapshotChanges();
  }

  public GetProyectosPorTipo(proyectosTipo:BehaviorSubject<string>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return proyectosTipo.switchMap(tipoProy => this._db.list('/proyectos', ref => ref.orderByChild('tipo').equalTo(tipoProy)).snapshotChanges());
  }

  public GetProyectosPorInstitucion(proyectosInstit:BehaviorSubject<string>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return proyectosInstit.switchMap(instit => this._db.list('/proyectos', ref => ref.orderByChild('institucion').equalTo(instit)).snapshotChanges());
  }

  public AuthUser():Observable<any>{

  	return this._auth.authState;
  	
  }

  

}
