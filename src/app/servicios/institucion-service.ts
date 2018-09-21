import { Injectable } from '@angular/core';
import { AgendaService } from './agenda.service';
import { Organizacion } from '../clases/organizacion';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class InstitucionService extends AgendaService {

	constructor(db:AngularFireDatabase,storage:AngularFireStorage,auth:AngularFireAuth){
		super(db,storage,auth);
	}

	public GetInstituciones():Observable<AngularFireAction<DatabaseSnapshot>[]>{
	  return this._db.list('/organizaciones').snapshotChanges();
	}

	public GetInstitucionesPorTipo(organizacionesSub:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot>[]>{
	   return organizacionesSub.switchMap(tipo_org => this._db.list('/organizaciones', ref => tipo_org ? ref.orderByChild('tipo').equalTo(tipo_org) : ref).snapshotChanges());
	}

	public GetInstitucionesAsObject():Observable<any>{
		return this._db.object('/organizaciones').valueChanges();
	}

	public GetInstitucion(_id:string):Observable<any>{
	  return this._db.object('/organizaciones/'+_id).valueChanges();
	}

	public GuardaInstitucion(item:Organizacion){
		return this._db.list("/organizaciones").push(item.ToJSon());
	  //return this._db.object("/organizaciones/".concat(clave.toLowerCase())).set(item.ToJSon());
	}

	public ActualizaInstitucion(item:Organizacion, clave:string){
	  return this._db.object("/organizaciones/".concat(clave)).update(item.ToJSon());
	}

	public EliminaInstitucion(clave:string):Promise<void>{
	  return this._db.object("/organizaciones/".concat(clave)).remove();
	}

	public InstitucionesConProyectos(anio:number):AngularFireAction<DatabaseSnapshot>[]{
		let lista:AngularFireAction<DatabaseSnapshot>[] = [];

		this._db.list('/proyectos/').snapshotChanges().subscribe((proyectos) => {
			let listaClaves:string[] = [];

			for(let proyecto of proyectos){
				if(listaClaves.indexOf(proyecto.payload.val().id_organizacion) < 0){
					listaClaves.push(proyecto.key);
				}
			}

			this._db.list('/organizaciones').snapshotChanges().subscribe((datos) => {
				for(let org of datos){
					if(listaClaves.indexOf(org.key) >= 0){
						lista.push(org);
					}
				}
			});
		});

		return lista;
	}

	public GetAlcaldias():Observable<AngularFireAction<DatabaseSnapshot>[]>{
		return this._db.list('/organizaciones',ref => ref.orderByChild('tipo').equalTo('alcaldia')).snapshotChanges();
	}
}
