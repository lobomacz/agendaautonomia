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
//import { pdfMake } from 'pdfmake';

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
  private combo:boolean;
  private fecha:string;
  private logoUrl:string = '/assets/img/logo_cgraas.png';
  private escudoUrl:string = '/assets/img/logoGrun.png';
  private grunUrl:string = '/assets/img/LogoGrun2019.jpg';

  private instituciones:AngularFireAction<DatabaseSnapshot>[];
  private proyectos:AngularFireAction<DatabaseSnapshot>[];
  private alcaldias:AngularFireAction<DatabaseSnapshot>[];
  private sectores:AngularFireAction<DatabaseSnapshot>[];
  private transferencias:AngularFireAction<DatabaseSnapshot>[];

  constructor(private iService:InstitucionService, private pService:ProyectosService, private _route:ActivatedRoute, private _router:Router, private _auth:AuthserviceService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.combo = false;
    this.dialogo_annio = false;
    this.annio = null;
    this.fecha = new Date().toLocaleDateString();

  }

  ngOnInit() {
  	this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;
    this.pService.GetLastProjectYear().subscribe((dat) => {
      if(dat.length > 0){
        this.annio = dat[0].anio;
      }
    });

    if(this.usuarioId === null){
      this.Redirect('/error');
    }

    this.CheckParams();
  }

  CheckParams(){

    if(this._route.snapshot.paramMap.has('tipo')){
      this.tipoReporte = this._route.snapshot.paramMap.get('tipo');

      this.annio = parseInt(this._route.snapshot.paramMap.get('annio'));

      if(this._route.snapshot.paramMap.has('idOrg')){
        this.idInstitucion = this._route.snapshot.paramMap.get('idOrg');
      }

      this.LlenaDatos();
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
              console.table(datos_temp);
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
            this.sectores = sec;
            this.datosReporte = this.ProcesaPorSector(this.proyectos.map(this.ArrayPorSector));
          });
          
          break;
        case "fuente":
          this.datosReporte = this.ProcesaPorFuente(this.proyectos.map(this.ArrayPorFuente));
          break;
        case "inversion":
          this.datosReporte = this.ProcesaPorInversion(this.proyectos.map(this.ArrayPorFuente));
          this.IncluyeTransferencias(this.datosReporte,'inversion');
          break;

        default:
          this.datosReporte = this.ProcesaInstitucionSector(this.proyectos.map(this.ArrayPorInstitucionSector));
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

  BuscaDatos(tipo:string,combo:boolean){
    this.combo = combo;
    this.tipoReporte = tipo;

    if(this.combo === true){
      this.datosReporte = this.ProcesaPorInstitucion(this.proyectos.map(this.ArrayPorInstitucion));
      this.iService.GetInstituciones().subscribe((v) => {
        this.instituciones = v;
        this.instituciones = this.InstitucionesConProyectos();
      });
      
    }


    this.dialogo_annio = true;
  }

  CerrarModal(event:Event){
    this.combo = false;
    this.dialogo_annio = false;
    //this.annio = null;

    event.preventDefault();
  }

  OnSeleccionarAnnio(event:Event){

    this.LlenaDatos();

    //this.CreaReporte();

    this.CerrarModal(event);

    event.preventDefault();

  }

  CreaReporte(){

    let contenido:any[];
    let encabezado:any;
    let logo:any;
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
          //df.setLogo(dataUrl);

          this.toDataURL(this.escudoUrl, (dataU) => {
            df.setEscudo(dataU);

            this.toDataURL(this.grunUrl,(dataUl) => {
              df.setLogoPie(dataUl);
              pdfMake.createPdf(df.toJSON()).open();
            });
            
          });
          
        });
        

        break;
      case "sector":
        // code...
        break;
      case "fuente":
        // code...
        break;
      case "inversion":
        // code...
        break;

      default:
        // code...
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
    let clave:string;// = dato.payload.val().tipo;
    let valor:number;// = dato.payload.val().monto;
    let valor2:number;// = dato.payload.val().cooperacion;

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
        for(let transf of this.transferencias){
          seleccion['cooperacion'] += transf.payload.val().cext;
          seleccion['tesoro'] += transf.payload.val().tesoro;
        }
        break;
      default:
        for(let transf of this.transferencias){
          let valor = transf.payload.val().cext + transf.payload.val().tesoro;
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
