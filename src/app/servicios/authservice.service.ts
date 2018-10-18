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

  constructor(_db:AngularFireDatabase, _storage:AngularFireStorage,private _auth:AngularFireAuth) { 
  	super(_db, _storage);
    this.usuario = new Usuario();
  }


  public AuthUser():User{
  	return this.authUser;
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

  private GetUsuarioObservable(tipoUsuario:string, _id:string):Observable<any>{
  	let fuente:string = tipoUsuario == 'admin' ? 'admins':'usuarios';
  	const ruta:string = `/${fuente}/${_id}`;
  	return this._db.object(ruta).valueChanges();
  }

  public Login(email:string,contrasena:string):void{

    this._auth.auth.signInWithEmailAndPassword(email,contrasena).then((cred) => {
      if (cred != null && cred.user.uid != undefined) {
        //this._auth.auth.setPersistence()
        this.authUser = cred.user;
        this.GetUsuarioObservable('usuario',this.authUser.uid).subscribe((v) => {
          if (v != undefined) {
            this.usuario = new Usuario(v);
          }else{
            this.GetUsuarioObservable('admin',this.authUser.uid).subscribe((dato) => {
              this.usuario = new Usuario(dato);
            });
          }
        });
      }
    });

  }

  public Logout(){
    this._auth.auth.signOut();
  }

  public GetUsuario():Usuario{
    return this.usuario;
  }

}
