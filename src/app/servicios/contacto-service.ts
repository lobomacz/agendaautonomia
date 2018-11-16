import { AgendaService } from './agenda.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Funcionario } from '../clases/funcionario';

@Injectable()
export class ContactoService extends AgendaService {

	constructor(db:AngularFireDatabase,storage:AngularFireStorage){
		super(db,storage);
	}

	public GetContactosObservable(contactSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
  	return contactSubject.switchMap(instit => this._db.list('/contactos', ref => instit ? ref.orderByChild('organizacion').equalTo(instit) : ref).snapshotChanges());
  }

  public GetContactoObservable(_id:string):Observable<any>{
    return this._db.object('/contactos/'.concat(_id)).valueChanges();
  }

  public GuardaContacto(funcionario:Funcionario):any{
    let item = funcionario.ToJSon();
    return this._db.list('/contactos/').push(item);
    //return this._db.ref('/contactos/'.concat(clave)).set()
  }

  public ActualizaContacto(clave:string, funcionario:Funcionario):any{
    return this._db.object('/contactos/'.concat(clave)).update(funcionario.ToJSon());
  }

  public EliminaContacto(clave:string):Promise<void>{
    return this._db.object("/contactos/".concat(clave)).remove();
  }

  public GetFotoContacto(id:string, nombre:string):Observable<string>{
    return this._storage.ref('/contactos/'.concat(id, "/foto/", nombre)).getDownloadURL();
  }

  public GuardaFotoContacto(id:string, nombre:string, archivo:any):Observable<string>{
    this._storage.ref('/temp/'.concat(nombre)).delete();
    let ref = this._storage.ref('/contactos/'.concat(id, "/foto/", nombre));

    return ref.put(archivo).downloadURL();
  }

  public GuardaFotoTemp(nombre:string, archivo:any):Observable<string>{
    let ref = this._storage.ref('/temp/'.concat(nombre));

    return ref.put(archivo).downloadURL();
  }

  public UpdateFotoContact(id:string, anterior:string, nuevo:string, archivo:any):Observable<string>{
    this._storage.ref('/contactos/'.concat(id, "/foto/", anterior)).delete();
    return this.GuardaFotoContacto(id,nuevo,archivo);
  }

  public BorraImagen(imagenUrl:string){
    this._storage.ref(imagenUrl).delete();
  }
  
}
