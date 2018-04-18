import { Component, OnInit } from '@angular/core';
import { AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AgendaService } from "../../agenda.service";

@Component({
  selector: 'macz-organizaciones',
  templateUrl: './organizaciones.component.html',
  styleUrls: ['./organizaciones.component.scss']
})
export class OrganizacionesComponent implements OnInit {


	public usuario:any;

  constructor() { }

  ngOnInit() {
  }

}
