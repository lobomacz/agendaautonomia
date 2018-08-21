import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Funcionario } from '../../clases/funcionario';
import { Usuario } from '../../clases/usuario';
import { Mensaje } from '../../clases/mensaje';

import { AuthserviceService } from '../../servicios/authservice.service';
import { ContactoService } from '../../servicios/contacto-service';
import { InstitucionService } from '../../servicios/institucion-service';


@Component({
  selector: 'macz-editar',
  templateUrl: '../contacto.plantilla.html', //'./editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

	private usuario:any;
	private _id:string;
	private nuevo:boolean;
	private fotoFile:any;
	private fotoUrl:string;
	private nombreFoto:string;
	private funcionario?:Funcionario;
	private funcionarioGuardado:boolean;
	private usuarioFuncionario?:Usuario;
	private crearUsuario:boolean;
	private resetPassword:boolean;
	private contrasena:string;
	private confirmaContrasena:string;
	private oldTipoUsuario:string;
	private usuarioGuardado:boolean;
	private organizacione$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private municipio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;

	private mostrarDialogo:boolean;
	private mensajeDialogo:Mensaje;

  constructor(private _activeRoute:ActivatedRoute, private _auth:AuthserviceService, private _cService:ContactoService, private _iService:InstitucionService, private _router:Router) {
  	this.usuario = false;
  	this._id = this._activeRoute.snapshot.paramMap.get('id');
  	this.nuevo = false;
  	this.fotoFile = null;
  	this.fotoUrl = 'assets/img/unknown-user.png';
  	this.nombreFoto = '';
  	this.funcionario = new Funcionario();
  	this.funcionarioGuardado = false;
  	this.usuarioFuncionario = null;
  	this.crearUsuario = false;
  	this.resetPassword = false;
  	this.usuarioGuardado = false;

  	this.mostrarDialogo = false;
  	this.mensajeDialogo = new Mensaje();
  }

  ngOnInit() {

  	this._cService.GetContactoObservable(this._id).subscribe(datos =>{
  		this.funcionario = new Funcionario(datos);
  		this._cService.GetFotoContacto(this._id,this.funcionario.foto).subscribe(imgUrl =>{
  			this.fotoUrl = imgUrl;
  		});
  		this._auth.GetUsuario('admin',this._id).subscribe(datos => {
  			if (datos != null) {
  				this.usuarioFuncionario = new Usuario(datos);
  				this.crearUsuario = false;
  				this.oldTipoUsuario = 'admin';
  			}else{
  				this._auth.GetUsuario('usuario',this._id).subscribe(datos1 => {
  					if (datos1 != null) {
  						this.usuarioFuncionario = new Usuario(datos1);
  						this.crearUsuario = false;
  						this.oldTipoUsuario = 'usuario';
  					}
  				});
  			}
  		});
  	});

  	this.municipio$ = this._cService.GetMunicipios();
  	this.organizacione$ = this._iService.GetInstituciones();
  	
  }

  ngOnDestroy() {
    this.Elimina_Foto_Temporal();
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

  Guardar_Foto(accion:string, id?:string){

  	if(accion === 'guardar'){
  		this._cService.GuardaFotoContacto(id, this.nombreFoto, this.fotoFile).subscribe(imgUrl => this.fotoUrl = imgUrl);
  	}else{
  		this._cService.GuardaFotoTemp(this.nombreFoto, this.fotoFile).subscribe(imgUrl => this.fotoUrl = imgUrl);
  	}
  }

  On_Guardar_Click(){

  	if (this.fotoFile != null) {
  		this.funcionario.foto = this.nombreFoto;
  	}

  	let that = this;

  	this.Guardar_Foto('guardar', this._id);

  	//Falta manejar el caso de error mostrando un diálogo con el mensaje de error.
  	this._cService.ActualizaContacto(this._id, this.funcionario).then(() => {
  		this.Redirect();
  	});

  	//Falta la implementación del cambio en el tipo de usuario.

  }

  On_TipoUsuario_Check(tipo:string){
  	if(this.usuarioFuncionario !== null){
  		this.usuarioFuncionario.tipoUsuario = tipo;
  	}
  }

  On_Cambia_Contrasenna_Click(evento:Event){
  	//FALTA IMPLEMENTACIÓN
  }

  Redirect(){
  	this._router.navigateByUrl('/contactos/ver/'.concat(this._id));
  }

}
