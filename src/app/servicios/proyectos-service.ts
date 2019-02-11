import { AgendaService } from './agenda.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Proyecto } from '../clases/proyecto';


@Injectable()
export class ProyectosService extends AgendaService {

	constructor(db:AngularFireDatabase,storage:AngularFireStorage){
		super(db,storage);
	}

	GetSectores():Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return this._db.list('/sectoresDesarrollo').snapshotChanges();
	}

	GetProyectosPorAnio(subject:BehaviorSubject<number>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap(anio => this._db.list('/proyectos', ref => anio ? ref.orderByChild('anio').equalTo(anio):ref).snapshotChanges());
	}

	GetProyectosPorSector(subject:BehaviorSubject<string>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap(sector => this._db.list('/proyectos', ref => ref.orderByChild('sector').equalTo(sector)).snapshotChanges());
	}

	GetProyectosPorInstitucion(subject:BehaviorSubject<string>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap(instit => this._db.list('/proyectos', ref => ref.orderByChild('id_organizacion').equalTo(instit)).snapshotChanges());
	}

	GetProyecto(id:string):Observable<any>{
		return this._db.object('/proyectos/'.concat(id)).valueChanges();
	}

	IngresaProyecto(proyecto:Proyecto):any{
		return this._db.list('/proyectos').push(proyecto.ToJSon());
	}

	ActualizaProyecto(proyecto:Proyecto, _id:string):Promise<void>{
		return this._db.object('/proyectos/'.concat(_id)).update(proyecto.ToJSon());
	}

	BorraProyecto(_id:string):Promise<void>{
		return this._db.object('/proyectos/'.concat(_id)).remove();
	}

	GetPersonalProyecto(id:string):Observable<any>{
		return this._db.object('/personalProyectos/'.concat(id)).valueChanges();
	}

	IngresaPersonalProyecto(id:string,personal:any):Promise<void>{
		return this._db.object('/personalProyectos/'.concat(id)).set(personal);
	}

	ActualizaPersonalProyecto(id:string,personal:any):Promise<void>{
		return this._db.object('/personalProyectos/'.concat(id)).update(personal);
	}

	BorraPersonalProyecto(id:string):Promise<void>{
		return this._db.object('/personalProyectos/'.concat(id)).remove();
	}

	GetSitiosProyecto(proyecto:string):Observable<any[]>{
		return this._db.list('/sitiosProyectos/'.concat(proyecto)).valueChanges();
	}

	IngresaSitiosProyecto(proyecto:string, sitios:any[]):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(proyecto,'/')).set(sitios);
	}

	ActualizaSitiosProyecto(proyecto:string, sitio:any[]):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(proyecto)).update(sitio);
	}

	BorraSitioProyecto(proyecto:string, indiceSitio:number):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(proyecto,'/',indiceSitio.toString(),'/',)).remove();
	}

	BorraSitiosProyecto(id:string):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(id)).remove();
	}

	GetLastProjectYear():Observable<any[]>{
		return this._db.list('/proyectos', ref => ref.orderByChild('anio').limitToFirst(1)).valueChanges();
	}

}
