import { AgendaService } from './agenda.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Funcionario } from '../clases/funcionario';

@Injectable()
export class ContactoService extends AgendaService {

	constructor(db:AngularFireDatabase,storage:AngularFireStorage,auth:AngularFireAuth){
		super(db,storage,auth);
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
  
}
