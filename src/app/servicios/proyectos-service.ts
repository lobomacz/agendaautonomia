import { AgendaService } from './agenda.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Proyecto } from '../clases/proyecto';


@Injectable()
export class ProyectosService extends AgendaService {

	constructor(db:AngularFireDatabase,storage:AngularFireStorage,auth:AngularFireAuth){
		super(db,storage,auth);
	}

	GetSectores():Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return this._db.list('/sectores-desarrollo').snapshotChanges();
	}

	GetProyectosPorAnio(subject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap(anio => this._db.list('/proyectos', ref => anio ? ref.orderByChild('anio').equalTo(anio):ref).snapshotChanges());
	}

	GetProyectosPorSector(subject:BehaviorSubject<string>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap(sector => this._db.list('/proyectos', ref => ref.orderByChild('sector').equalTo(sector)).snapshotChanges());
	}

	GetProyectosPorInstitucion(subject:BehaviorSubject<string>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return subject.switchMap(instit => this._db.list('/proyectos', ref => ref.orderByChild('id_organizacion').equalTo(instit)).snapshotChanges());
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

}
