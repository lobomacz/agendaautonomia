import { Component, OnInit, Input } from '@angular/core';
import { OpcionNav } from '../../clases/opcion-nav';
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
 
  public usuario:any;


  private contactos:Observable<AngularFireAction<DatabaseSnapshot>[]>;
  private contactosSubject: BehaviorSubject<string | null>;

  private organizaciones:Observable<any[]>;

  constructor( private _service:ContactoService, private _institService:InstitucionService ) {

    this.contactosSubject = new BehaviorSubject(null);
    
  }

  suscribeMunicipios(municipio:string | null):any{
    
  }

  ngOnInit() {
    this.contactos = this._service.GetContactosObservable(this.contactosSubject);
    this.organizaciones = this._institService.GetInstituciones();
  }

  BuscaFoto(nombre:string):string{
    let foto$:any = this._service.GetFotoContacto(nombre);
    let fotoUrl:string;
    foto$.subscribe(imgUrl => fotoUrl = imgUrl);
    return fotoUrl;
  }

}
