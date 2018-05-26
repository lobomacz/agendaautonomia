import { Component, OnInit, Input } from '@angular/core';
import { OpcionNav } from '../../clases/opcion-nav';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AgendaService } from "../../agenda.service";


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

  constructor( private _service:AgendaService ) {

    this.contactosSubject = new BehaviorSubject(null);
    
    
  }

  suscribeMunicipios(municipio:string | null):any{
    
  }

  ngOnInit() {
    this.contactos = this._service.GetContactosObservable(this.contactosSubject);
    this.organizaciones = this._service.GetAllOrganizaciones();
  }

  BuscaFoto(nombre:string):string{
    let foto$:any = this._service.GetFotoContacto(nombre);
    let fotoUrl:string;
    foto$.subscribe(imgUrl => fotoUrl = imgUrl);
    return fotoUrl;
  }

}
