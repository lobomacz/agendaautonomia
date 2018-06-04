import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';

import { AgendaService } from '../../agenda.service';
import { Funcionario } from '../../clases/funcionario';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'macz-nuevo',
  templateUrl: '../contacto.plantilla.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {

	private usuario:any;
  private nuevo:boolean;
  private guardado:boolean;
  private foto_temp_nombre:string;
	private funcionario:Funcionario;
  private organizaciones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private regiones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private municipiosSub:BehaviorSubject<string | null>;
  private municipios:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  

  constructor(private _service:AgendaService, private router:Router) { 
    this.municipiosSub = new BehaviorSubject(null);
    this.foto_temp_nombre = "assets/img/unknown-user.png";
    this.guardado = false;
    this.nuevo = true;
  }

  ngOnInit() {
  	this.funcionario = new Funcionario();
  	this.funcionario.nombre = '';
  	this.funcionario.organizacion = '';
  	this.funcionario.cargo = '';
  	this.funcionario.region = '';
  	this.funcionario.municipio = '';
  	this.funcionario.correo = '';
  	this.funcionario.telefono = '';
  	this.funcionario.movil = '';

    this.organizaciones = this._service.GetInstituciones();
    this.regiones = this._service.GetRegiones();
    this.municipios = this._service.GetMunicipiosPorRegion(this.municipiosSub);
  }

  ngOnDestroy() {
    if (this.guardado == false && this.funcionario.foto.indexOf("assets") < 0 && this.nuevo == true) {
      let ruta:string = "/user_imgs/" + this.foto_temp_nombre;
      this._service.BorraImagen(ruta);
    }
  }

  OnFotoChange(foto:any) {
    let tipo_archivo:string;
    let partes:string[];
    let nombre_archivo:string;


    partes = this.funcionario.nombre.toLowerCase().split(" ");

    if(partes.length > 1){
      nombre_archivo = partes[0].charAt(0).concat("_", partes[1]);
    }else{
      nombre_archivo = partes[0].concat("_user");
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
      this.funcionario.foto = nombre_archivo;
      this.foto_temp_nombre = imgUrl;
    });

  }

  OnSelectRegion(){
    this.municipiosSub.next(this.funcionario.region);
  }

  OnGuardar() {
    let clave:string = this.funcionario.foto.split(".")[0];
    let that = this;
    this._service.GuardaContacto(clave,this.funcionario).then(
        function(){
          that.Redirect();
        }
      ).catch(error => {
        if(error.message.indexOf('object_not_found')>=0){
          let nueva_clave = '/contactos';
          let item = {clave:that.funcionario.ToJSon()};
          that._service.GetDb().object(nueva_clave).set(item).then(_ => {
            that.Redirect();
          });
        }
      });
  }

  Redirect(){
    this.guardado = true;
    this.router.navigateByUrl('/contactos');
  }

}
