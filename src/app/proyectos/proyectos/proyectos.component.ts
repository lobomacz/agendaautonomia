import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ProyectosService } from '../../servicios/proyectos-service';
import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from "../../servicios/authservice.service";

@Component({
  selector: 'macz-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

	public usuarioId:string;
  public esAdmin:boolean;
	public opcionFiltro:string;
	public filtro:string;
  public annio:number;
  public listaProyectos:AngularFireAction<DatabaseSnapshot>[];
  public paginaProyectos:AngularFireAction<DatabaseSnapshot>[];
  public listaOpciones:AngularFireAction<DatabaseSnapshot>[];
  public listaSectores:AngularFireAction<DatabaseSnapshot>[];
  public listaOrganizaciones:any;
  public page:number;
  public loading:boolean;
  public limit:number;
  public total:number;
  
	private aniosSubject:BehaviorSubject<number>;
	private sectorSubject:BehaviorSubject<{anio:string,sector:string}>;
	private institucionSubject:BehaviorSubject<{anio:string,instit:string}>;
	private proyecto_anio$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private proyecto_sector$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	private proyecto_institucion$:Observable<AngularFireAction<DatabaseSnapshot>[]>;
	
  


  constructor(private _service:ProyectosService, private _institService:InstitucionService, private _router:Router, private _auth:AuthserviceService) {
  	this.opcionFiltro = 'anio';
    this.limit = 20;
    this.total = 0;
    this.loading = false;
    this.page = 1;
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;

    if(this.usuarioId === null){
      this.Redirect('/error');
    }


    this._service.GetLastProjectYear().subscribe((dato) => {

      this._auth.IsAdmin(this.usuarioId).subscribe((v) => {
        if(v.key !== null){
          this.esAdmin = true;
        }
      });

      this._service.GetSectores().subscribe(lista => {
        this.listaSectores = lista;
      });


      this._institService.GetInstitucionesAsObject().subscribe(objeto => {
        this.listaOrganizaciones = objeto;
      });

      this.annio = Number.parseInt(dato[0].key);
      this.aniosSubject = new BehaviorSubject(this.annio);
      this.opcionFiltro = 'anio';
      this.filtro = this.annio.toString();

      this.proyecto_anio$ = this._service.GetProyectosPorAnio(this.aniosSubject);

      this.LlenaProyectos();

    });

    
    
    

  }

  onNextPage():void{
    this.page++;
    this.getPage();
  }

  onPrevPage():void{
    this.page--;
    this.getPage();
  }

  goToPage(n:number):void{
    this.page = n;
    this.getPage();
  }

  getPage():void{
    let start = (this.page - 1) * this.limit;
    let end = start + this.limit;

    if (end >= this.total) {
      this.paginaProyectos = this.listaProyectos.slice(start);
    }else{
      this.paginaProyectos = this.listaProyectos.slice(start, end);
    }
  }

  BuscaOrganizacion(clave:string):string{
    let nombre:string = "N/C";

    if(this.listaOrganizaciones != null && this.listaOrganizaciones.length > 0){
      for(let organizacion of this.listaOrganizaciones){
        if(organizacion.key == clave){
          nombre = organizacion.payload.val().nombre_corto;
        }
      }
    }
    
    return nombre;
  }

  /* TODO:
  Mejorar la programación al obtener la lista de proyectos ya que actualmente
  se ve código repetitivo en las tres opciones de filtrado. LlenaProyectos puede
  simplificarse con el uso de un solo Observer llamado proyecto$ el cual se llena eventualmente
  con las llamadas a cada subject.
   */
  LlenaProyectos(){

    if (this.page > 1) {
      this.page = 1;
    }

  	switch (this.opcionFiltro) {

  		case "sector":
  			this.proyecto_sector$.subscribe(lista => {
          this.listaProyectos = lista;
          this.total = this.listaProyectos.length;
          if(this.total>this.limit){
            this.getPage();
          }else{
            this.paginaProyectos = this.listaProyectos;
          }
          
        });
  			break;
  		case "institucion":
  			this.proyecto_institucion$.subscribe(lista => {
          this.listaProyectos = lista;
          this.total = this.listaProyectos.length;
          if(this.total>this.limit){
            this.getPage();
          }else{
            this.paginaProyectos = this.listaProyectos;
          }
        });
  			break;
  		default:
  			this.proyecto_anio$.subscribe(lista => {
		  		this.listaProyectos = lista;
          this.total = this.listaProyectos.length;
          if(this.total>this.limit){
            this.getPage();
          }else{
            this.paginaProyectos = this.listaProyectos;
            
          }
		  	});
  			break;
  	}

  }

  GetOpcionesSectores(){
    this._service.GetSectores().subscribe((list) => {
      this.listaOpciones = list;
    });
  }

  GetOpcionesInstituciones(){
    this._institService.GetInstituciones().subscribe((list) => {
      this.listaOpciones = list;
    });
  }

  GetOpcionesGtis(){
    this._institService.GetInstitucionesPorTipo(new BehaviorSubject("publico")).subscribe((list) => {
      this.listaOpciones = list.filter((option) => {
        return option.payload.val().nivel == 'territorial';
      });

      console.table(this.listaOpciones);
    });
  }

  setTipoFiltro(opcion:string){
    this.filtro = '';
  	this.opcionFiltro = opcion;

  	switch (this.opcionFiltro) {
  		case "sector":
  			this.GetOpcionesSectores();
  			break;
  		case "institucion":
  			this.GetOpcionesInstituciones();
  			break;
      case "gti":
        this.GetOpcionesGtis();
        break;
  	}
    this.UpdateLista();
  }
  

  UpdateLista(){
  	switch (this.opcionFiltro) {

  		case "sector":
  			if(this.sectorSubject == undefined){
  				this.sectorSubject = new BehaviorSubject({'anio':this.annio.toString(),'sector':this.filtro});
  				this.proyecto_sector$ = this._service.GetProyectosPorSector(this.sectorSubject);
  			}else{
  				this.sectorSubject.next({'anio':this.annio.toString(),'sector':this.filtro});
  			}
  			break;
  		case "institucion":
  			if(this.institucionSubject == undefined){
  				this.institucionSubject = new BehaviorSubject({'anio':this.annio.toString(),'instit':this.filtro});
  				this.proyecto_institucion$ = this._service.GetProyectosPorInstitucion(this.institucionSubject);
  			}else{
  				this.institucionSubject.next({'anio':this.annio.toString(),'instit':this.filtro});
  			}
  			break;
  		default:
  			this.aniosSubject.next(Number.parseInt(this.filtro));
  			break;
  	}

  	this.LlenaProyectos();
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home')
  }

}
