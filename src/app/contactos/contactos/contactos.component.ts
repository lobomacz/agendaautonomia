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
 
  private usuarioId:string;
  private esAdmin:boolean;
  private contactosSubject:BehaviorSubject<string | null>;
  private contacto$?:AngularFireAction<DatabaseSnapshot>[];
  private contactoVacio:boolean;

  private organizacione$?:Observable<any>;
  private organizaciones?:any;

  constructor(private _router:Router, private _service:ContactoService, private _institService:InstitucionService, private _auth:AuthserviceService) {
    this.contactosSubject = new BehaviorSubject(null);
    this.contacto$ = null;
    this.contactoVacio = false;
    this.organizacione$ = null;
    this.organizaciones = null;
    this.esAdmin = false;
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

    this._service.GetContactosObservable(this.contactosSubject).subscribe(datos => {
      if (datos.length > 0) {
        this.contacto$ = datos;
        this.organizacione$ = this._institService.GetInstitucionesAsObject();
        this.organizacione$.subscribe(orgs => {
          this.organizaciones = orgs;
        });
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

}
