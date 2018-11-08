import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Chart } from 'chart.js';
import { InstitucionService } from '../../servicios/institucion-service';
import { ProyectosService } from '../../servicios/proyectos-service';
import { AuthserviceService } from "../../servicios/authservice.service";
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
  @ViewChild("chartPorInversion") porInversion:any;

	private usuarioId:string;
	private annio:number;
	private filtroInstitucion:string;
	private annioSubject:BehaviorSubject<number>;
	private proyectos:AngularFireAction<DatabaseSnapshot>[];
	private instituciones:AngularFireAction<DatabaseSnapshot>[];
	private institucionesProyectos:AngularFireAction<DatabaseSnapshot>[];
  private alcaldias:AngularFireAction<DatabaseSnapshot>[];
	private sectores:AngularFireAction<DatabaseSnapshot>[];

	private cPorInstituciones:Chart;
	private cPorSector:Chart;
	private cPorFuente:Chart;
	private cPorIS:Chart;
  private cPorInversion:Chart;

	private datosPorI:any;
	private datosPorS:any;
	private datosPorF:any;
	private datosPorIS:any;
  private datosPorInv:any;

	private colores:string[];

  constructor(private _router:Router, private iService:InstitucionService, private pService:ProyectosService, private _auth:AuthserviceService) { 
  	this.annio = new Date().getFullYear();

  	this.colores = [
  		"#1e90ff",
  		"#9b59b6",
      "#87d369",
      "#e67e22",
  		"#E63183",
  		"#060",
  		"#ff6b81",
  		"#ffb900",
  		"#f7f7f7",
  		"#28b485",
  		"#33f",
  		"#bc1339",
  		"#ffeb56",
  		"#2ed573",
  		"#777",
      "#ff7730",
  		"#bc3cb4",
  		"#5eeded",
  		"#2998ff",
  		"#ff4949",
  		"#f1c40f",
  		"#2c3e50"
  	];
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;
    if(this.usuarioId === null){
      this.Redirect('/error');
    }
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

      this.iService.GetAlcaldias().subscribe(res => {
        this.alcaldias = res;
      });

  		this.iService.GetInstituciones().subscribe(res => {
  			this.instituciones = res;
  			this.datosPorI = this.ProcesaPorInstitucion(this.proyectos.map(this.ArrayPorInstitucion));
  			this.ChartPorInstitucion();
  			this.institucionesProyectos = this.InstitucionesConProyectos();
  			this.filtroInstitucion = this.institucionesProyectos[0].key;

  			this.pService.GetSectores().subscribe(res => {

	  			this.sectores = res;
	  			this.datosPorS = this.ProcesaPorSector(this.proyectos.map(this.ArrayPorSector));
	  			this.ChartPorSector();

	  			this.datosPorF = this.ProcesaPorFuente(this.proyectos.map(this.ArrayPorFuente));
	  			this.ChartPorFuente();

	  			this.datosPorIS = this.ProcesaInstitucionSector(this.proyectos.map(this.ArrayPorInstitucionSector));
	  			this.ChartPorIS();

	  		});

        this.datosPorInv = this.ProcesaPorInversion(this.proyectos.map(this.ArrayPorFuente));
        this.ChartPorInversion();

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
  	let clave:string;// = dato.payload.val().tipo;
  	let valor:number;// = dato.payload.val().monto;
    let valor2:number;// = dato.payload.val().cooperacion;

    clave = dato.payload.val().tipo;
    valor = dato.payload.val().cooperacion;
    valor2 = dato.payload.val().monto;


  	return {'fuente':clave, 'cext':valor, 'monto':valor2};
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

    for(let alcaldia of this.alcaldias){
      if(!(alcaldia.key in Object.keys(seleccion))){
        this.iService.GetTransferenciaPip(this.annio,alcaldia.key).subscribe((trans) => {
          
        });
      }
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

    //AGREGADOS PARA PRESENTAR GRÁFICO DE BARRAS

    let dataset:any[] = [];

    for (let sector in seleccion) {
      let dato:any = {};
      dato['x'] = sector;
      dato['y'] = seleccion[sector];
      dataset.push(dato);
    }

    
    //Reemplazado por dataset para gráfico de barras
  	return seleccion;
    //return dataset;
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

        let AddSeleccion:any = function(fuente:string,monto:number){
          if(seleccion[fuente.toUpperCase()] === undefined){
            seleccion[fuente.toUpperCase()] = monto;
          }else{
            seleccion[fuente.toUpperCase()] += monto;
          }
        };

  			let clave:string = valor.fuente;
        let fuente:string;
        let monto:number;

        if(clave === 'privado'){

          fuente = clave;
          monto = valor.monto;
          AddSeleccion(fuente,monto);

        }else if(clave === 'ong'){

          fuente = 'cooperacion';
          monto = valor.monto;
          AddSeleccion(fuente,monto);

        }else{

          if(valor.cext > 0){
            fuente = 'cooperacion';
            monto = valor.cext;
            AddSeleccion(fuente,monto);
          }

          if(valor.monto > valor.cext){
            fuente = 'tesoro';
            monto = valor.monto - valor.cext;
            AddSeleccion(fuente,monto);
          }
        }

  			
  		});
  	}

  	return seleccion;
  }

  ProcesaPorInversion(datos:any[]):any{

    let seleccion:any = {};

    datos.forEach((valor) => {
      let tipo = valor.fuente.toUpperCase();

      if(seleccion[tipo] === undefined){
        seleccion[tipo] = valor.monto;
      }else{
        seleccion[tipo] += valor.monto;
      }

    });

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
  		type:'doughnut',
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


  	let ctx = this.porSector.nativeElement.getContext('2d');

  	this.cPorSector = new Chart(ctx,{
  		type:'bar',
  		data:{
  			labels:etiquetas,
  			datasets:[{
          label:'Inversión por sector',
  				data:valores,
  				backgroundColor:this.colores
  			}]
  		},
  		options:{
  			//animation:{animateRotate:true},
  			legend:{
  				display:false,
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
  		type:'bar',
  		data:{
  			labels:etiquetas,
  			datasets:[{
          label:'Fuente de Financ.',
  				data:valores,
  				backgroundColor:this.colores
  			}]
  		},
  		options:{
  			/*animation:{
  				animateRotate:true,
          animateScale:true
  			},*/
  			title:{
  				text:"Distribución de la Inversión por Fuente de Financiamiento.",
  				fontColor:'#f7f7f7',
  				display:true,
  				fontSize:14
  			},
  			legend:{
  				display:false,
  			}
  		}
  	});
  }

  ChartPorIS(){

    console.log(this.porIS.nativeElement);

    if (this.cPorIS !== undefined){
      delete this.cPorIS;
    }

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
  		type:'doughnut',
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

  ChartPorInversion(){

    let etiquetas:string[] = Object.keys(this.datosPorInv);
    let valores:number[] = Object.values(this.datosPorInv);

    let ctx = this.porInversion.nativeElement.getContext('2d');

    this.cPorInversion = new Chart(ctx,{
      type:'polarArea',
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
          text:"Inversiones en el Caribe Sur ".concat(this.annio.toString()),
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

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home');
  }

}
