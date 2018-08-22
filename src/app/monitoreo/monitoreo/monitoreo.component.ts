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
	@ViewChild("chartPorFuente") porFuente:any;
	@ViewChild("chartIS") porIS:any;

	private usuario:any;
	private annio:number;
	private filtroInstitucion:string;
	private annioSubject:BehaviorSubject<number>;
	private proyectos:AngularFireAction<DatabaseSnapshot>[];
	private instituciones:AngularFireAction<DatabaseSnapshot>[];
	private institucionesProyectos:AngularFireAction<DatabaseSnapshot>[];
	private sectores:AngularFireAction<DatabaseSnapshot>[];

	private cPorInstituciones:Chart;
	private cPorSector:Chart;
	private cPorFuente:Chart;
	private cPorIS:Chart;

	private datosPorI:any;
	private datosPorS:any;
	private datosPorF:any;
	private datosPorIS:any;

	private colores:string[];

  constructor(private iService:InstitucionService, private pService:ProyectosService) { 
  	this.annio = new Date().getFullYear();

  	this.colores = [
  		"#1e90ff",
  		"#9b59b6",
  		"#bc1339",
  		"#E63183",
  		"#e67e22",
  		"#060",
  		"#ff6b81",
  		"#ff7730",
  		"#ffb900",
  		"#f7f7f7",
  		"#28b485",
  		"#33f",
  		"#87d369",
  		"#ffeb56",
  		"#2ed573",
  		"#777",
  		"#bc3cb4",
  		"#5eeded",
  		"#2998ff",
  		"#ff4949",
  		"#f1c40f",
  		"#2c3e50"
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

  		this.iService.GetInstituciones().subscribe(res => {
  			this.instituciones = res;
  			this.datosPorI = this.ProcesaPorInstitucion(this.proyectos.map(this.ArrayPorInstitucion));
  			this.ChartPorInstitucion();
  			this.institucionesProyectos = this.InstitucionesConProyectos();
  			this.filtroInstitucion = this.institucionesProyectos[0].key;
  			console.log(this.institucionesProyectos);

  			this.pService.GetSectores().subscribe(res => {
	  			this.sectores = res;
	  			this.datosPorS = this.ProcesaPorSector(this.proyectos.map(this.ArrayPorSector));
	  			this.ChartPorSector();

	  			this.datosPorF = this.ProcesaPorFuente(this.proyectos.map(this.ArrayPorFuente));
	  			this.ChartPorFuente();

	  			this.datosPorIS = this.ProcesaInstitucionSector(this.proyectos.map(this.ArrayPorInstitucionSector));
	  			this.ChartsPorIS();
	  		});
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
  	let clave = dato.payload.val().id_organizacion;
  	let dato1 = dato.payload.val().sector;
  	let dato2 = dato.payload.val().monto;
  	return {'organizacion':clave,'sector':dato1,'monto':dato2};
  }

  ArrayPorFuente(dato:any,indice:number):any{
  	let clave = dato.payload.val().tipo;
  	let valor = dato.payload.val().monto;
  	return {'fuente':clave,'monto':valor};
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

  ProcesaInstitucionSector(datos:any[]):any{
  	let seleccion = {};

  	if(datos !== null && datos.length > 0){
  		datos.forEach((valor) => {
  			let clave = valor.organizacion;
  			let entrada = [];
  			entrada[valor.sector] = valor.monto;
  			if(seleccion[clave] == null){
  				seleccion[clave] = entrada;
  			}else{
  				if (seleccion[clave][valor.sector] == null) {
  					seleccion[clave][valor.sector] = valor.monto;
  				}else{
  					seleccion[clave][valor.sector] += valor.monto;
  				}
  			}
  		});
  	}

  	return seleccion;
  }

  ProcesaPorFuente(datos:any[]):any{
  	let seleccion = {};

  	if(datos !== null && datos.length > 0){
  		datos.forEach((valor) => {
  			let clave = valor.fuente.toUpperCase();
  			if(seleccion[clave] === undefined){
  				seleccion[clave] = valor.monto;
  			}else{
  				seleccion[clave] += valor.monto;
  			}
  		});
  	}

  	return seleccion;
  }

  InstitucionesConProyectos():AngularFireAction<DatabaseSnapshot>[]{
  	let lista:AngularFireAction<DatabaseSnapshot>[] = [];
  	
  	for(let clave of Object.keys(this.datosPorI)){

  		this.instituciones.forEach((valor) => {
  			if(valor.key === clave){
  				lista.push(valor);
  			}
  		});
  	}

  	console.log(lista);
  	return lista;
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

  ChartPorFuente(){
  	let etiquetas = Object.keys(this.datosPorF);
  	let valores = Object.values(this.datosPorF);

  	let ctx = this.porFuente.nativeElement.getContext('2d');

  	this.cPorFuente = new Chart(ctx,{
  		type:'pie',
  		data:{
  			labels:etiquetas,
  			datasets:[{
  				data:valores,
  				backgroundColor:this.colores
  			}]
  		},
  		options:{
  			animation:{
  				animateRotate:true
  			},
  			title:{
  				text:"Distribución de la Inversión por Fuente de Financiamiento.",
  				fontColor:'#f7f7f7',
  				display:true,
  				fontSize:14
  			},
  			legend:{
  				display:true,
  				position:'bottom',
  				labels:{
  					fontColor:'#f7f7f7'
  				}
  			}
  		}
  	});
  }

  ChartsPorIS(){

  	let nombre:string;

  	this.institucionesProyectos.forEach((valor) => {
  		if (valor.key === this.filtroInstitucion) {
  			nombre = valor.payload.val().nombre_corto.toUpperCase();
  		}
  	});

  	let datos:any[] = this.datosPorIS[this.filtroInstitucion];
  	let etiquetas:any[] = Object.keys(datos);
  	let valores:number[] = Object.values(datos);

  	for (let eti of etiquetas) {
  		etiquetas[etiquetas.indexOf(eti)] = this.NombreSector(eti).toUpperCase();
  	}

  	let ctx = this.porIS.nativeElement.getContext('2d');

  	this.cPorIS = new Chart(ctx,{
  		type:'pie',
  		data:{
  			labels:etiquetas,
  			datasets:[{
  				data:valores,
  				backgroundColor:this.colores
  			}]
  		},
  		options:{
  			animation:{
  				animateRotate:true
  			},
  			legend:{
  				display:true,
  				position:'bottom',
  				labels:{
  					fontColor:'#f7f7f7'
  				}
  			},
  			title:{
  				text:"Distribución de la Inversión por Sector para ".concat(nombre),
  				fontColor:'#f7f7f7',
  				fontSize:14,
  				display:true
  			}
  		}
  	});

  }

  VerReporte(evento:Event,tipo:string):void{

  	evento.preventDefault();

  }

}
