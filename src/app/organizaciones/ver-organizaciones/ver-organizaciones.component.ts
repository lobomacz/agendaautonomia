import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AgendaService } from '../../agenda.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'macz-ver-organizaciones',
  templateUrl: './ver-organizaciones.component.html',
  styleUrls: ['./ver-organizaciones.component.scss']
})
export class VerOrganizacionesComponent implements OnInit {

	private idOrg:string;
	private organizacion$:Observable<any>;
	private organizacion:any;

  constructor(private activatedRoute:ActivatedRoute, private _service:AgendaService) { 
  	this.idOrg = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  	this.organizacion$ = this._service.GetOrganizacion(this.idOrg);
  	this.organizacion$.subscribe(item => {this.organizacion = item});
  }

}
