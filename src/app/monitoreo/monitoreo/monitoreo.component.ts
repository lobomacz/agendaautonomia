import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Chart } from 'chart.js';
import { InstitucionService } from '../../servicios/institucion-service';
import { ProyectosService } from '../../servicios/proyectos-service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'macz-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit {

	@ViewChild("chartPorInstitucion") porInstitucion:any;

	@ViewChild("chartPorSector") porSector:any;

	private usuario:any;
	private annio:number;
	private annioSubject:BehaviorSubject<number>;
	private proyectos:AngularFireAction<DatabaseSnapshot>[];
	private instituciones:AngularFireAction<DatabaseSnapshot>[];
	private sectores:AngularFireAction<DatabaseSnapshot>[];

	private cPorInstituciones:Chart;
	private cPorSector:Chart;
	private cInstitSector:Chart;

	private datosPorI:any;
	private etiquetasPorI:string[];
	private datosPorS:any;
	private etiquetasPorS:string[];
	private datosPorIS:any;
	private etiquetasPorIS:string[];

	private colores:string[];

  constructor(private iService:InstitucionService, private pService:ProyectosService) { 
  	this.annio = new Date().getFullYear();

  	this.colores = [
  		"#bc1339",
  		"#E63183",
  		"#060",
  		"#ff7730",
  		"#ffb900",
  		"#f7f7f7",
  		"#28b485",
  		"#33f",
  		"#87d369",
  		"#ffeb56",
  		"#777",
  		"#bc3cb4",
  		"#5eeded",
  		"#2998ff",
  		"#ff4949",
  	];
  }

  ngOnInit() {
  	this.annioSubject = new BehaviorSubject(this.annio);
  }

  ngAfterViewInit(){
  	this.LlenaDatos();
  }

  BuscarDatos(evento:Event){

  	evento.preventDefault();
  }

  LlenaDatos(){

  	this.pService.GetProyectosPorAnio(this.annioSubject).subscribe(res => {
  		this.proyectos = res;

  		this.pService.GetSectores().subscribe(res => {
  			this.sectores = res;
  			this.datosPorS = this.ProcesaPorSector(this.proyectos.map(this.ArrayPorSector));
  			this.ChartPorSector();
  		});

  		this.iService.GetInstituciones().subscribe(res => {
  			this.instituciones = res;
  			this.datosPorI = this.ProcesaPorInstitucion(this.proyectos.map(this.ArrayPorInstitucion));
  			this.ChartPorInstitucion();
  		});
  		

  	});

  	
  }

  ArrayPorInstitucion(dato:any,indice:number):any{
  	let clave = dato.payload.val().id_organizacion;
  	let valor = dato.payload.val().monto;
  	return {'organizacion':clave,'monto':valor};
  }

  ArrayPorSector(dato:any,indice:number):any{
  	let clave = dato.payload.val().sector;
  	let valor = dato.payload.val().monto;
  	return {'sector':clave,'monto':valor};
  }

  ArrayPorInstitucionSector(dato:any,indice:number):any{
  	let clave = dato.payload.val().organizacion;
  	let dato1 = dato.payload.val().sector;
  	let dato2 = dato.payload.val().monto;
  	return {'organizacion':clave,'sector':dato1,'monto':dato2};
  }

  ProcesaPorInstitucion(datos:any[]):any{
  	let seleccion = {};

  	if(datos !== null && datos.length > 0){
  		
  		datos.forEach((valor) => {
  			let clave:string;
  			clave = valor.organizacion;
	  		if(seleccion[clave] == undefined){
	  			seleccion[clave] = valor.monto;
	  		}else{
	  			seleccion[clave] += valor.monto;
	  		}
	  	});

  	}

  	return seleccion;
  }

  ProcesaPorSector(datos:any[]):any{
  	let seleccion = {};

  	if(datos !== null && datos.length > 0){
  		datos.forEach((valor) => {
  			let nombre:string = this.NombreSector(valor.sector).toUpperCase();
  			if(seleccion[nombre] == undefined){
  				seleccion[nombre] = valor.monto;
  			}else{
  				seleccion[nombre] += valor.monto;
  			}
  		});
  	}

  	return seleccion;

  }

  NombreOrganizacion(clave:string):string{
  	let nombre:string;
  	
  	for(let item of this.instituciones){
  		if (item.key === clave) {
  			nombre = item.payload.val().nombre_corto;
  		}
  	}

  	return nombre;
  }

  NombreSector(clave:number):string{
  	return this.sectores[clave].payload.val();
  }

  ChartPorInstitucion(){
  	let etiquetas:string[] = Object.keys(this.datosPorI);
  	let valores:number[] = Object.values(this.datosPorI);

  	//etiquetas = etiquetas.map(this.NombreOrganizacion);
  	for (let eti of etiquetas) {
  		etiquetas[etiquetas.indexOf(eti)] = this.NombreOrganizacion(eti);
  	}
  	
  	let ctx = this.porInstitucion.nativeElement.getContext('2d');

  	this.cPorInstituciones = new Chart(ctx,{
  		type:'pie',
  		data:{
  			labels:etiquetas,
  			datasets:[
  				{
  					data:valores,
  					backgroundColor:this.colores
  				}
  			]
  		},
  		options:{
  			animation:{animateRotate:true},
  			legend:{
  				display:true,
  				position:"bottom",
  				labels:{fontColor:'#f7f7f7'}
  				
  			},
  			title:{
  				display:true,
  				text:"Distribución de la Inversión por Institución en la RACCS.",
  				fontColor:"#f7f7f7",
  				fontSize:14,
  			}
  		},

  	});
  }

  ChartPorSector(){
  	let etiquetas:string[] = Object.keys(this.datosPorS);
  	let valores:number[] = Object.values(this.datosPorS);

  	//etiquetas = etiquetas.map(this.NombreSector);

  	let ctx = this.porSector.nativeElement.getContext('2d');

  	this.cPorSector = new Chart(ctx,{
  		type:'pie',
  		data:{
  			labels:etiquetas,
  			datasets:[{
  				data:valores,
  				backgroundColor:this.colores
  			}]
  		},
  		options:{
  			animation:{animateRotate:true},
  			legend:{
  				display:true,
  				position:'bottom',
  				labels:{fontColor:'#f7f7f7'}
  			},
  			title:{
  				text:"Distribución de la Inversión por Sector en la RACCS.",
  				fontColor:'#f7f7f7',
  				fontSize:14,
  				display:true
  			}
  		}
  	});
  }

}
