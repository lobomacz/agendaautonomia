import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { InstitucionService } from '../../servicios/institucion-service';
import { ProyectosService } from '../../servicios/proyectos-service';
import { AuthserviceService } from '../../servicios/authservice.service';
import { DocDefinition } from '../../clases/doc-definition';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'macz-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

	private usuarioId:string;	
	private tipoReporte:string;
  private datosReporte:any[];
  private idInstitucion:string;
	private annio:number;
  private annioSubject:BehaviorSubject<number>;
	private dialogo_annio:boolean;
  private fecha:string;
  private logoUrl:string = '/assets/img/logo_cgraas.png';
  private escudoUrl:string = '/assets/img/logoGrun.png';
  private grunUrl:string = '/assets/img/LogoGrun2019.jpg';

  private instituciones:AngularFireAction<DatabaseSnapshot>[];
  private proyectos:AngularFireAction<DatabaseSnapshot>[];
  private alcaldias:AngularFireAction<DatabaseSnapshot>[];
  private sectores:AngularFireAction<DatabaseSnapshot>[];
  private transferencias:AngularFireAction<DatabaseSnapshot>[];

  constructor(
    private iService:InstitucionService, 
    private pService:ProyectosService, 
    private _route:ActivatedRoute, 
    private _router:Router, 
    private _auth:AuthserviceService
    ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.dialogo_annio = false;
    this.annio = null;
    this.fecha = new Date().toLocaleDateString();

  }

  ngOnInit() {
  	this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;
    this.pService.GetLastProjectYear().subscribe((dat) => {
      if(dat.length > 0){
        this.annio = Number.parseInt(dat[0].key);
      }
    });

    if(this.usuarioId === null){
      this.Redirect('/error');
    }

    
  }

  
  LlenaDatos(){

    this.annioSubject = new BehaviorSubject(this.annio);

    this.pService.GetProyectosPorAnio(this.annioSubject).subscribe(res => {

      this.proyectos = res;
      
      switch (this.tipoReporte) {

        case "institucion":

          this.iService.GetTransferenciasPip(this.annio).subscribe((trans) => {

            this.iService.GetInstituciones().subscribe((datos) => {

              this.instituciones = datos;

              let datos_temp = this.ProcesaPorInstitucion(this.proyectos.map(this.ArrayPorInstitucion));
              this.IncluyeTransferencias(datos_temp, this.tipoReporte, trans.map(this.ArrayTrasferencias));
              
              this.datosReporte = [[{text:'No.',style:'encabezadoTabla'},{text:'INSTITUCIÓN',style:'encabezadoTabla'},{text:'INVERSIÓN',style:'encabezadoTabla'}]];
              let count:number = 1;
              let total:number = 0;
              for (let dato in datos_temp) {
                this.datosReporte.push([count,this.NombreOrganizacion(dato),{text:Number.parseFloat(datos_temp[dato]).toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMoneda'}]);
                //this.datosReporte[count] = [count,this.NombreOrganizacion(dato),Number.parseFloat(datos_temp[dato]).toFixed(2)];
                count++;
                total += Number.parseFloat(datos_temp[dato]);
              }
              this.datosReporte.push(['',{text:'Total',style:'encabezadoTabla'},{text:total.toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMonedaTotal'}]);
              this.CreaReporte();

            });

          });

          
          break;

        case "sector":
          this.pService.GetSectores().subscribe(sec => {
            this.datosReporte = [[{text:'No.',style:'encabezadoTabla'},{text:'SECTOR',style:'encabezadoTabla'},{text:'INVERSIÓN',style:'encabezadoTabla'}]];
            this.sectores = sec;
            let datos_temp = this.ProcesaPorSector(this.proyectos.map(this.ArrayPorSector));
            let count:number = 1;
            let total:number = 0;
            for(let dato in datos_temp){
              this.datosReporte.push([count, dato, {text:Number.parseFloat(datos_temp[dato]).toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMoneda'}]);
              count++;
              total += Number.parseFloat(datos_temp[dato]);
            }

            this.datosReporte.push([{text:'Total', colSpan:2, alignment:'right', style:'encabezadoTabla'},{},{text:total.toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMonedaTotal'}])

            this.CreaReporte();

          });
          
          break;
        case "fuente":
          this.iService.GetTransferenciasPip(this.annio).subscribe((trans) => {
            this.datosReporte = [[{text:'No.',style:'encabezadoTabla'},{text:'FUENTE',style:'encabezadoTabla'},{text:'INVERSIÓN',style:'encabezadoTabla'}]];
            let datos_temp = this.ProcesaPorFuente(this.proyectos.map(this.ArrayPorFuente));
            this.IncluyeTransferencias(datos_temp, 'fuente', trans.map(this.ArrayTrasferencias));
            let count = 1;

            for (let dato in datos_temp) {
              this.datosReporte.push([count, dato, {text:Number.parseFloat(datos_temp[dato]).toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMoneda'}]);
              count++;
            }

            this.CreaReporte();
          });
          break;
        case "inversion":

          this.iService.GetTransferenciasPip(this.annio).subscribe((trans) => {
            this.datosReporte = [[{text:'No.',style:'encabezadoTabla'},{text:'TIPO INV.',style:'encabezadoTabla'},{text:'MONTO',style:'encabezadoTabla'}]];
            let datos_temp = this.ProcesaPorInversion(this.proyectos.map(this.ArrayPorFuente));
            this.IncluyeTransferencias(datos_temp, 'inversion',trans.map(this.ArrayTrasferencias));
            let count = 1;

            for(let dato in datos_temp){
              this.datosReporte.push([count, dato, {text:Number.parseFloat(datos_temp[dato]).toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMoneda'}]);
              count++;
            }

            this.CreaReporte();
          });

          
          break;

        default:
          
          this.iService.GetInstituciones().subscribe((instit) => {
            this.instituciones = instit;

            this.pService.GetSectores().subscribe((sec) => {

              this.sectores = sec;

              let datos_temp = this.ProcesaInstitucionSector(this.proyectos.map(this.ArrayPorInstitucionSector));

              this.datosReporte = [[{colSpan:3,text:'Datos Por Sector Por Institucion', style:'encabezadoTabla', alignment:'center'},{},{}]];
              for (let dato in datos_temp) {
                let count:number = 1;
                let total:number = 0;
                this.datosReporte.push([{text:this.NombreOrganizacion(dato), style:'encabezadoTabla', colSpan:3, alignment:'center'},{},{}]);

                for(let sector of datos_temp[dato]){
                  if(sector) {
                    
                    this.datosReporte.push([count, {text:this.NombreSector(datos_temp[dato].indexOf(sector)).toUpperCase()}, {text:sector.toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMoneda'}]);
                    count++;
                    total += sector;
                  }
                }

                this.datosReporte.push([{colSpan:2, text:'TOTAL', style:'encabezadoTabla', alignment:'right'}, {}, {text:total.toLocaleString('es-NI',{style:'currency',currency:'NIO'}),style:'celdaMonedaTotal'}])
              }
              
              this.CreaReporte();
            });
          });
          break;
      }
      
    });
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home')
  }

  BuscaDatos(tipo:string){
    
    this.tipoReporte = tipo;

    this.dialogo_annio = true;
  }

  CerrarModal(event:Event){

    this.dialogo_annio = false;

    event.preventDefault();
  }

  OnSeleccionarAnnio(event:Event){

    this.LlenaDatos();

    this.CerrarModal(event);

    event.preventDefault();

  }

  CreaReporte(){

    let encabezado:any;
    let cuerpo:any;
    let tabla:any;

    switch (this.tipoReporte) {

      case "institucion":

        encabezado = {
          text:"Reporte de Inversión por Institución",
          style:'encabezado2'
        }; 

        cuerpo = {
          text:`A continuación se detalla el monto de inversión en la región consolidado por institución. Se incluyen todas las instituciones que ejecutan proyectos en la región durante el año ${this.annio}.`,
          style:'parrafo'
        };

        tabla = {
          table:{
            heatherRows:1,
            widths:[40,'*','auto'],
            body: this.datosReporte
          }
        };


        
        this.DocumentoReporte(encabezado, cuerpo, tabla);
        

        break;
      case "sector":
        
        encabezado = {
          text:"Reporte de Inversión por Sector Económico",
          style:'encabezado2'
        }; 

        cuerpo = {
          text:`A continuación se detalla el monto de inversión en la región consolidado por sector económico. Se incluyen todas las instituciones que ejecutan proyectos en la región durante el año ${this.annio}.`,
          style:'parrafo'
        };

        tabla = {
          table:{
            heatherRows:1,
            widths:[40,'*','auto'],
            body: this.datosReporte
          }
        };


        this.DocumentoReporte(encabezado,cuerpo,tabla);

        break;
      case "fuente":
        

        encabezado = {
          text:"Reporte de Inversión por Fuente de Financiamiento",
          style:'encabezado2'
        }; 

        cuerpo = {
          text:`A continuación se detalla el monto de inversión en la región consolidado por fuente de financiamiento. Se reflejan los montos de las fuentes de cooperación externa, fondos del tesoro y la inversión privada en la región durante el año ${this.annio}.`,
          style:'parrafo'
        };

        tabla = {
          table:{
            heatherRows:1,
            widths:[40,'*','auto'],
            body: this.datosReporte
          }
        };


        this.DocumentoReporte(encabezado,cuerpo,tabla);

        break;
      case "inversion":
        
        encabezado = {
          text:"Reporte por Tipo de Inversión",
          style:'encabezado2'
        }; 

        cuerpo = {
          text:`A continuación se detallan los montos consolidados por tipo de inversión en la región. Se reflejan los montos de inversión privad, inversión pública y las inversiones de las alcaldías municipales en la región durante el año ${this.annio}.`,
          style:'parrafo'
        };

        tabla = {
          table:{
            heatherRows:1,
            widths:[40,'*','auto'],
            body: this.datosReporte
          }
        };

        this.DocumentoReporte(encabezado,cuerpo,tabla);

        break;

      default:
        
        encabezado = {
          text:"Reporte por Institución y Sector",
          style:'encabezado2'
        }; 

        cuerpo = {
          text:`A continuación se detallan los montos consolidados por institución y sector de desarrollo en la región. Se reflejan los montos de los proyectos agrupados por institución y sector de desarrollo durante el año ${this.annio}.`,
          style:'parrafo'
        };

        tabla = {
          table:{
            heatherRows:1,
            widths:[40,'*','auto'],
            body: this.datosReporte
          }
        };

        this.DocumentoReporte(encabezado,cuerpo,tabla);

        break;
    }
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
    let clave:string;
    let valor:number;
    let valor2:number;

    clave = dato.payload.val().tipo;
    valor = dato.payload.val().cooperacion;
    valor2 = dato.payload.val().monto;


    return {'fuente':clave, 'cext':valor, 'monto':valor2};
  }

  ArrayTrasferencias(dato:any, indice:number):any{
    let clave = dato.key;
    let valor1 = dato.payload.val().cext;
    let valor2 = dato.payload.val().tesoro;
    return {'organizacion':clave,'coop':valor1,'tesoro':valor2};
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

  private IncluyeTransferencias(seleccion:any, opcion:string, transferencias:any[]){

    switch (opcion) {
      case "institucion":
        transferencias.forEach((v) => {
          
          let clave = v.organizacion;
          
          if(!(Object.keys(seleccion).find((val) => {return val === clave;}))) {

            seleccion[clave] = v.coop + v.tesoro;

          }

        });
        break;
      case "fuente":
        for(let transf of transferencias){
          seleccion['COOPERACION'] += transf.coop;
          seleccion['TESORO'] += transf.tesoro;
        }
        break;
      default:
        for(let transf of transferencias){
          let valor = transf.coop + transf.tesoro;
          seleccion['ALCALDIA'] += valor;
        }
        break;
    }

    
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
    
    for(let clave of Object.keys(this.datosReporte)){

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

  DocumentoReporte(encabezado:any,cuerpo:any,tabla:any[]){

    let contenido:any[];
    let logo:any;

    this.toDataURL(this.logoUrl,(dataUrl) => {

          logo = {
            columns:[
              {
                text:'',
                width:'*'
              },
              {
                image: dataUrl,
                width: 80,
                height: 40,
                margin:10,
              },
              {
                text:'',
                width:'*'
              }
            ]

            
          };

          contenido = [encabezado,logo,cuerpo,tabla];
        
          let df = new DocDefinition(this.fecha,this.annio);
          df.setContent(contenido);

          this.toDataURL(this.escudoUrl, (dataU) => {
            df.setEscudo(dataU);

            this.toDataURL(this.grunUrl,(dataUl) => {
              df.setLogoPie(dataUl);
              
              pdfMake.createPdf(df.toJSON()).open();
            });
            
          });
          
        });
  }

  private toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

}
