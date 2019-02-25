import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Funcionario } from '../../clases/funcionario';
import { Usuario } from '../../clases/usuario';
import { Mensaje } from '../../clases/mensaje';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthserviceService } from '../../servicios/authservice.service';
import { ContactoService } from '../../servicios/contacto-service';
import { InstitucionService } from '../../servicios/institucion-service';

@Component({
  selector: 'macz-nuevo',
  templateUrl: '../contacto.plantilla.html', //'./nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {

  public fotoUrl:string;
  public organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  public municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  public mostrarDialogo:boolean;
  public mensajeDialogo:Mensaje;
  public funcionario?:Funcionario;
  public usuarioFuncionario?:Usuario;
  public crearUsuario:boolean;
  public contrasena:string;
  public confirmaContrasena:string;

	private usuarioId:string;
	private _id:string;
	private nuevo:boolean;
	private fotoFile:any;
	private nombreFoto:string;
	private funcionarioGuardado:boolean;
	private resetPassword:boolean;
	private usuarioGuardado:boolean;
	

  constructor(private _auth:AuthserviceService, private _cService:ContactoService, private _iService:InstitucionService, private _router:Router) {
  	this._id = '';
  	this.nuevo = true;
  	this.fotoFile = null;
  	this.fotoUrl = 'assets/img/unknown-user.png';
  	this.nombreFoto = '';
  	this.funcionario = new Funcionario();
    this.usuarioFuncionario = new Usuario();
  	this.funcionarioGuardado = false;
  	this.usuarioFuncionario = null;
  	this.crearUsuario = false;
  	this.resetPassword = false;
  	this.usuarioGuardado = false;

  	this.mostrarDialogo = false;
  	this.mensajeDialogo = new Mensaje();
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;

    if(this.usuarioId === null){
      this.Redirect('/error');
    }else{
      this._auth.IsAdmin(this.usuarioId).subscribe((v) => {
        if(v.key === null){
          this.Redirect('/error');
        }
      });
    }

  	this.organizacione$ = this._iService.GetInstituciones();
  	this.municipio$ = this._cService.GetMunicipios();
  }

  ngOnDestroy() {
    this.Elimina_Foto_Temporal();
  }

  GetNombreArchivo():string{
    let tipo_archivo:string;
    let partes:string[];
    let nombre_archivo:string;


    partes = this.funcionario.nombre.toLowerCase().split(" ");

    if(partes.length > 1){
      nombre_archivo = partes[0].charAt(0).concat("_", partes[1]);
    }else{
      nombre_archivo = partes[0].concat("_user");
    }

    tipo_archivo = this.fotoFile.type.split('/')[1];

    if (tipo_archivo === "jpeg") {
      nombre_archivo += ".jpg";
    } else if (tipo_archivo === "png") {
      nombre_archivo += ".png";
    }

    return nombre_archivo;
  }

  Elimina_Foto_Temporal(){
  	if (this.fotoFile != null) {
      let ruta:string = "/temp/".concat(this.nombreFoto);
      this._cService.BorraImagen(ruta);
    }
  }

  On_Foto_Change(foto:any){
  	this.Elimina_Foto_Temporal();
  	this.fotoFile = foto.files[0];
    this.nombreFoto = this.GetNombreArchivo();
    this.Guardar_Foto("temp");
  }

  On_Guardar_Click(){

  	if(this.fotoFile != null){
      this.funcionario.foto = this.nombreFoto;
    }
    
    let that = this;

    //Si guardado es 'false' quiere decir que aún no se ha ingresado el funcionario.
    //Caso contrario, habría que ingresar solo el usuario si así estuviera indicado.
    if(this.funcionarioGuardado == false){
      this._cService.GuardaContacto(this.funcionario).then(
        (ref) => {
          that._id = ref.key;
          that.funcionarioGuardado = true;
          if (that.fotoFile != null) {
            that.Guardar_Foto("guardar",that._id);
          }

          //Guardamos el usuario si se marcó para generarle usuario al nuevo funcionario.
          if (that.crearUsuario == true) {
          	that.usuarioFuncionario.idFuncionario = that._id;
            that.Guardar_Usuario().then(credenciales => {
              
            	let uid:string = credenciales.uid;
            	that._auth.CreaUsuario(uid, that.usuarioFuncionario).then(() => {
            		that.Redirect('/contactos/ver/'.concat(that._id));
            	});
            });
          }else{
            that.Redirect('/contactos/ver/'.concat(that._id));
          }
        }
      );
    }else if(this.usuarioGuardado == false && this.crearUsuario == true){
      this.Guardar_Usuario().then(credenciales => {
	    	let uid:string = credenciales.user.uid;
	    	that._auth.CreaUsuario(uid, that.usuarioFuncionario).then(() => {
	    		that.Redirect('/contactos/ver/'.concat(that._id));
	    	});
	    });
    }
  }

  Guardar_Usuario():Promise<any>{
  	return this._auth.GeneraCredencial(this.funcionario.correo, this.contrasena);
  }

  Guardar_Foto(accion:string, id?:string){

  	if(accion === 'guardar'){
  		this._cService.GuardaFotoContacto(id, this.nombreFoto, this.fotoFile).subscribe(imgUrl => this.fotoUrl = imgUrl);
  	}else{
  		this._cService.GuardaFotoTemp(this.nombreFoto, this.fotoFile).subscribe(imgUrl => this.fotoUrl = imgUrl);
  	}
  }

  On_TipoUsuario_Check(tipo:string){
  	if(this.usuarioFuncionario !== null){
  		this.usuarioFuncionario.tipoUsuario = tipo;
  	}
  }

  On_CreaUsuario_Click(elemento:any){
    
    if (this.usuarioFuncionario == null || this.usuarioFuncionario == undefined) {
      this.usuarioFuncionario = new Usuario();
    }
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home')
  }

}
