import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Funcionario } from '../../clases/funcionario';
import { Mensaje } from '../../clases/mensaje';

import { ContactoService } from '../../servicios/contacto-service';
import { InstitucionService } from '../../servicios/institucion-service';

@Component({
  selector: 'macz-editar',
  templateUrl: '../contacto.plantilla.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

	private _id:string;
	private funcionarioObs:Observable<any>;
  private organizaciones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  //private regiones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private munisipiosSub:BehaviorSubject<string | null>;
  private municipios:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private funcionario:Funcionario;
  private foto_temp_nombre:string;
  private foto_old_nombre:string;
	private mensaje:Mensaje;
	private dialogo_mensaje:boolean;
  private usuario:any;
  private guardado:boolean;
  private nuevo:boolean;

  constructor(private _service:ContactoService, private router:Router, private route:ActivatedRoute, private _institService:InstitucionService) {
  	this._id = this.route.snapshot.paramMap.get('id');
    this.funcionario = new Funcionario();
    this.foto_old_nombre = "";
    this.foto_temp_nombre = "";
  	this.dialogo_mensaje = false;
  	this.mensaje = new Mensaje();
    this.guardado = false;
    this.nuevo = false;
  }

  ngOnInit() {
    this.funcionarioObs = this._service.GetContactoObservable(this._id);
  	this.funcionarioObs.subscribe(item => {
      this.funcionario = new Funcionario(item);
      if(this.funcionario.foto.indexOf("assets") < 0){
        let foto$:Observable<string> = this._service.GetFotoContacto(this.funcionario.foto);
        foto$.subscribe(imgUrl => {
          this.foto_temp_nombre = imgUrl;
        });
      }else{
        this.foto_temp_nombre = this.funcionario.foto;
      }
    }, err => {
      this.mensaje.titulo = "Error al recuperar datos.";
      this.mensaje.mensaje = "No se recuperaron datos del contacto. Error: "+err;
      this.mensaje.tipo = Mensaje.T_MENSAJE.T_ERROR;
      this.dialogo_mensaje = true;
    });

    //this.munisipiosSub = new BehaviorSubject(null);

    this.GetListas();
  }

  ngOnDestroy(){
    if(this.guardado == false && this.foto_old_nombre != ""){
      this._service.BorraImagen(this.funcionario.foto);
    }
  }

  GetListas():void{
    this.organizaciones = this._institService.GetInstituciones();
    //this.regiones = this._service.GetRegiones();
    this.municipios = this._service.GetMunicipios(); //this._service.GetMunicipiosPorRegion(this.munisipiosSub);
  }

  /*
  OnSelectRegion(){
    this.munisipiosSub.next(this.funcionario.region);
  }*/

  OnFotoChange(foto:any){

    let tipo_archivo:string;
    let partes:string[];
    let nombre_archivo:string;
    let fecha:Date;
    fecha = new Date();

    partes = this.funcionario.nombre.toLowerCase().split(" ");

    if(partes.length > 1){
      let normal_part:string = partes[1].replace(/[áéíóúñ]/gi,"1");
      nombre_archivo = partes[0].charAt(0).concat("_", normal_part, fecha.getTime().toString());
    }else{
      nombre_archivo = partes[0].concat("_user",fecha.getTime().toString());
    }
    
    switch (foto.files[0].type.split('/')[1]) {
      case "jpeg":
        nombre_archivo += ".jpg";
        break;
      case "png":
        nombre_archivo += ".png";
        break;
      default:
        // code...
        break;
    }
    
    this._service.GuardaFotoContacto(nombre_archivo,foto.files[0]).subscribe(imgUrl => {
      this.foto_old_nombre = this.funcionario.foto;
      this.funcionario.foto = nombre_archivo;
      this.foto_temp_nombre = imgUrl;
    });

  }

  OnGuardar():void{
    let that = this;
    if(this.foto_old_nombre != "" && this.foto_old_nombre.indexOf("assets") < 0){
      this._service.BorraImagen(this.foto_old_nombre);
    }

    this._service.ActualizaContacto(this._id,this.funcionario).then(function(){
      that.router.navigateByUrl('/contactos/ver/'.concat(that._id));
    });
  	
  }

  CerrarDialogo(evento){

  	this.dialogo_mensaje = false;
  	this.mensaje = new Mensaje();

  	evento.preventDefault();
  }

}
