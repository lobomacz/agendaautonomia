import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot} from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs/Observable';

import { Usuario } from '../clases/usuario';

import { AgendaService } from './agenda.service';

@Injectable()
export class AuthserviceService extends AgendaService {

  constructor(_db:AngularFireDatabase, _storage:AngularFireStorage,private _auth:AngularFireAuth) { 
  	super(_db, _storage);
  }


  public AuthUser():User{
  	return this._auth.auth.currentUser;
  }

  public GeneraCredencial(correo:string, contrasena:string):Promise<any>{
 	  return this._auth.auth.createUserWithEmailAndPassword(correo, contrasena);
  }

  public ResetPassword(email:string, newPassword:string):Promise<any>{
  	let stateUrl = "http://si.graccs.gob.ni/agenda/contactos/reset/".concat(email);
  	return this._auth.auth.sendPasswordResetEmail(newPassword);
  }

  public CreaUsuario(uid:string, usuario:Usuario):Promise<void>{
    let tipo:string = usuario.tipoUsuario == 'admin' ? 'admins':'usuarios';
    const ruta:string = `/${tipo}/${uid}`;
    return this._db.object(ruta).set(usuario.ToJSon());
  }

  public GetUsuarioObservable(tipoUsuario:string, _id:string):Observable<AngularFireAction<DatabaseSnapshot>>{
  	let fuente:string = tipoUsuario == 'admin' ? 'admins':'usuarios';
  	const ruta:string = `/${fuente}/${_id}`;
  	return this._db.object(ruta).snapshotChanges();
  }

  public Login(email:string,contrasena:string):Promise<any>{
    
    return this._auth.auth.signInWithEmailAndPassword(email,contrasena);

  }

  public Logout():Promise<any>{
    return this._auth.auth.signOut();
  }

  IsAdmin(Id:string):Observable<AngularFireAction<DatabaseSnapshot>>{

    return this.GetUsuarioObservable('admin' , Id);

  }

}
