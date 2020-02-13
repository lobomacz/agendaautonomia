import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAction, DatabaseSnapshot, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContactoService } from "../../servicios/contacto-service";
import { InstitucionService } from '../../servicios/institucion-service';
import { AuthserviceService } from "../../servicios/authservice.service";


@Component({
  selector: 'macz-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent implements OnInit {
 
  public usuarioId:string;
  public paginaContactos:AngularFireAction<DatabaseSnapshot>[];
  public fotos:any;
  public organizaciones?:any;
  public page:number;
  public total:number;
  public limit:number;
  public loading:boolean;
  public esAdmin:boolean;
  public contacto$?:AngularFireAction<DatabaseSnapshot>[];

  private contactosSubject:BehaviorSubject<string | null>;
  private contactoVacio:boolean;
  private organizacione$?:Observable<any>;
  

  

  constructor(private _router:Router, private _service:ContactoService, private _institService:InstitucionService, private _auth:AuthserviceService) {
    this.contactosSubject = new BehaviorSubject(null);
    this.contacto$ = null;
    this.contactoVacio = false;
    this.organizacione$ = null;
    this.organizaciones = null;
    this.esAdmin = false;
    this.fotos = {};
    this.page = 1;
    this.total = 0;
    this.limit = 20;
    this.loading = false;
    this.paginaContactos = [];
  }

  suscribeMunicipios(municipio:string | null):any{
    
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;

    if(this.usuarioId === null){
      this.Redirect('/error');
    }

    this._auth.IsAdmin(this.usuarioId).subscribe((v) => {
      if(v.key !== null){
        this.esAdmin = true;
      }
    });

    this.organizacione$ = this._institService.GetInstitucionesAsObject();
        this.organizacione$.subscribe(orgs => {
          this.organizaciones = orgs;

          this._service.GetContactosObservable(this.contactosSubject).subscribe(datos => {
            if (datos.length > 0) {
              this.contacto$ = datos;


              for(let contacto of this.contacto$){
                if(contacto.payload.val().foto.indexOf('assets') < 0){
                  this.BuscaFoto(contacto.key, contacto.payload.val().foto).subscribe((v)=>{
                    this.fotos[contacto.key] = v;
                  });
                }
              }

              this.total = this.contacto$.length;
              if (this.total > this.limit) {
                this.getPage();
              }else{
                this.paginaContactos = this.contacto$;
              }

              
            }
          });


        });

  }

  getPage(){
    let start = (this.page - 1) * this.limit;
    let end = start + this.limit;

    if(end >= this.total){
      this.paginaContactos = this.contacto$.slice(start);
    }else{
      this.paginaContactos = this.contacto$.slice(start, end);
    }
  }

  onNextPage(){
    this.page++;
    this.getPage();
  }

  onPrevPage(){
    this.page--;
    this.getPage();
  }

  goToPage(n:number){
    this.page = n;
    this.getPage();
  }

  BuscaFoto(id:string, file:string):Observable<string>{
    return this._service.GetFotoContacto(id,file);
  }

  Redirect(ruta:string){
    this._router.navigateByUrl(ruta)
  }

  userLogout(){
    this.usuarioId = null;
    this.Redirect('/home')
  }

}
