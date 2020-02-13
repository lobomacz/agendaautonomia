import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import * as firebase from 'firebase/app';


@Injectable()
export class AgendaService {

	protected _db:AngularFireDatabase;
	protected _storage:AngularFireStorage;

  constructor(db:AngularFireDatabase,storage:AngularFireStorage) {
  	this._db = db;
  	this._storage = storage;
  }

  public GetDb():AngularFireDatabase{
    return this._db;
  }

  public GetRegiones():Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return this._db.list('/regiones').snapshotChanges();
  }

  public GetMunicipios():Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return this._db.list('/municipios').snapshotChanges();
  }

  public GetMunicipiosPorRegion(municipioSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return municipioSubject.switchMap(reg => this._db.list('/municipios', ref => reg ? ref.orderByChild('region').equalTo(reg) : ref).snapshotChanges());
  }

  public GetMunicipio(id:string):Observable<any>{
    return this._db.object('/municipios/'.concat(id)).valueChanges();
  }

  public GetComunidadesPorMunicipio(comunidadSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
    return comunidadSubject.switchMap(municipio => this._db.list('/comunidades', ref => municipio ? ref.orderByChild('municipio').equalTo(municipio):ref).snapshotChanges());
  }

  public GetComunidad(id:string):Observable<any>{
    return this._db.object('/comunidades/'.concat(id)).valueChanges();
  }

  public IngresaComunidades(comunidades:any[]):boolean{
    let exito = true;

    for(let comunidad of comunidades){
      this._db.list('/comunidades').push(comunidad).then(()=>{}, error=>{exito = false; return exito;});
    }

    return exito;
  }

  public LimpiaNombres():boolean{
    let limpio = true;
    let that = this;

    this._db.list('/comunidades').snapshotChanges().subscribe(lista => {
      for(let item of lista){
        let clave:string = item.key;
        let nombre:string = item.payload.val().nombre.trim();
        that._db.object('/comunidades/'.concat(clave)).update({"nombre":nombre}).then().catch(error => {return false});
      }
    });

    return limpio;
  }
  
}
