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

  private usuario:Usuario;
  private authUser:User;

  constructor(_db:AngularFireDatabase, _storage:AngularFireStorage, _auth:AngularFireAuth) { 
  	super(_db, _storage, _auth);
  }


  public AuthUser():Observable<any>{
  	return this._auth.authState;
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
    return this._db.object('/'.concat(tipo, '/', uid)).set(usuario.ToJSon());
  }

  public GetUsuario(tipoUsuario:string, _id:string):Observable<any[]>{
  	let fuente:string;

  	if (tipoUsuario == "usuario") {
  		fuente = "/usuarios/";
  	}else if(tipoUsuario == "admin"){
  		fuente = "/admins/";
  	}
  	
  	return this._db.list(fuente, ref => ref.orderByChild("idFuncionario").equalTo(_id)).valueChanges();
  }

}
