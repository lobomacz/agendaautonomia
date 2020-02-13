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
		return subject.switchMap(anio => this._db.list('/proyectos/'.concat(anio.toString())).snapshotChanges());
	}

	GetProyectosPorSector(subject:BehaviorSubject<{anio:string, sector:string}>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap((param) => this._db.list('/proyectos/'.concat(param.anio), ref => ref.orderByChild('sector').equalTo(param.sector)).snapshotChanges());
	}

	GetProyectosPorInstitucion(subject:BehaviorSubject<{anio:string, instit:string}>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap((param) => this._db.list('/proyectos/'.concat(param.anio), ref => ref.orderByChild('id_organizacion').equalTo(param.instit)).snapshotChanges());
	}

	GetProyecto(id:string, anio:string):Observable<any>{
		return this._db.object('/proyectos/'.concat(anio, '/',id)).valueChanges();
	}

	IngresaProyecto(proyecto:Proyecto):any{
		return this._db.list('/proyectos/'.concat(proyecto.anio.toString())).push(proyecto.ToJSon());
	}

	ActualizaProyecto(proyecto:Proyecto, _id:string):Promise<void>{
		return this._db.object('/proyectos/'.concat(proyecto.anio.toString(),'/', _id)).update(proyecto.ToJSon());
	}

	BorraProyecto(_id:string, anio:string):Promise<void>{
		return this._db.object('/proyectos/'.concat(anio, '/', _id)).remove();
	}

	GetPersonalProyecto(id:string, anio:string):Observable<any>{
		return this._db.object('/personalProyectos/'.concat(anio, '/', id)).valueChanges();
	}

	IngresaPersonalProyecto(id:string, personal:any, anio:string):Promise<void>{
		return this._db.object('/personalProyectos/'.concat(anio, '/', id)).set(personal);
	}

	ActualizaPersonalProyecto(id:string,personal:any, anio:string):Promise<void>{
		return this._db.object('/personalProyectos/'.concat(anio, '/', id)).update(personal);
	}

	BorraPersonalProyecto(id:string, anio:string):Promise<void>{
		return this._db.object('/personalProyectos/'.concat(anio, '/', id)).remove();
	}

	GetSitiosProyecto(proyecto:string, anio:string):Observable<any[]>{
		return this._db.list('/sitiosProyectos/'.concat(anio, '/', proyecto)).valueChanges();
	}

	IngresaSitiosProyecto(proyecto:string, sitios:any[], anio:string):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(anio, '/', proyecto,'/')).set(sitios);
	}

	ActualizaSitiosProyecto(proyecto:string, sitio:any[], anio:string):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(anio, '/', proyecto)).update(sitio);
	}

	BorraSitioProyecto(proyecto:string, indiceSitio:number, anio:string):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(anio, '/', proyecto,'/',indiceSitio.toString(),'/',)).remove();
	}

	BorraSitiosProyecto(id:string, anio:string):Promise<void>{
		return this._db.object('/sitiosProyectos/'.concat(anio, '/', id)).remove();
	}

	GetLastProjectYear():Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return this._db.list('/proyectos', ref => ref.orderByKey().limitToFirst(1)).snapshotChanges();
	}

}
