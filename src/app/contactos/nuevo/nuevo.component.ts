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
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {

	private usuario:any;
  private nuevo:boolean;
  private guardado:boolean;
  private foto_temp:string;
	private funcionario:Funcionario;
  private organizaciones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private regiones:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private municipiosSub:BehaviorSubject<string | null>;
  private municipios:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  

  constructor(private _service:AgendaService) { 
    this.municipiosSub = new BehaviorSubject(null);
    this.foto_temp = "";
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

    this.organizaciones = this._service.GetAllOrganizaciones();
    this.regiones = this._service.GetRegiones();
    this.municipios = this._service.GetMunicipiosPorRegion(this.municipiosSub);
  }

  ngOnDestroy() {
    if (this.guardado == false && this.foto_temp != "" && this.nuevo == true) {
      let ruta:string = "/user_imgs/" + this.foto_temp;
      this._service.BorraImagen(ruta);
    }
  }

  OnFotoChange(foto:any) {
    let tipo_archivo:string;
    let partes:string[];
    let nombre_archivo:string;
  	console.log('archivo');
  	console.log(foto.value);
  	console.log(foto.files[0].type);
    partes = this.funcionario.nombre.toLowerCase().split(" ");
    if(partes.length > 1){
      nombre_archivo = partes[0].charAt(0) + "_" + partes[1];
    }else{
      nombre_archivo = partes[0] + "_user";
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

    console.log(nombre_archivo);
    this._service.GuardaFotoContacto(nombre_archivo,foto.files[0]).subscribe(imgUrl => {
      this.funcionario.foto = imgUrl;
      this.foto_temp = nombre_archivo;
    });
  }

  OnSelectRegion(){
    console.log(this.funcionario.region);
    this.municipiosSub.next(this.funcionario.region);
  }

  OnGuardar(event:any,form:NgForm) {
    if(!form.invalid){

    }


  }

}
