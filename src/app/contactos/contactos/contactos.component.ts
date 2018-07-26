import { Component, OnInit } from '@angular/core';
import { AngularFireAction, DatabaseSnapshot, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContactoService } from "../../servicios/contacto-service";
import { InstitucionService } from '../../servicios/institucion-service';


@Component({
  selector: 'macz-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent implements OnInit {
 
  private usuario:any;

  private contactosSubject:BehaviorSubject<string | null>;
  private contacto$?:AngularFireAction<DatabaseSnapshot>[];
  private contactoVacio:boolean;

  private organizacione$?:Observable<any>;
  private organizaciones?:any;

  constructor(private _service:ContactoService, private _institService:InstitucionService) {

    this.contactosSubject = new BehaviorSubject(null);
    this.contacto$ = null;
    this.contactoVacio = false;
    this.organizacione$ = null;
    this.organizaciones = null;
    
  }

  suscribeMunicipios(municipio:string | null):any{
    
  }

  ngOnInit() {
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

}
