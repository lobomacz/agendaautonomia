import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendaService } from '../../agenda.service';
import { Funcionario } from '../../clases/funcionario';


@Component({
  selector: 'macz-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {

	private usuario:any;
	private funcionario:Funcionario;

  constructor(_service:AgendaService) { }

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
  }

  OnFotoChange(foto:any) {
  	console.log('archivo');
  	console.log(foto.value);
  	console.log(foto.files[0].type);
  }

  OnGuardar() {

  }

}
