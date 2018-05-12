import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendaService } from '../../agenda.service';
import { Funcionario } from '../../clases/funcionario';


@Component({
  selector: 'macz-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {

	private usuario:any;

  constructor(_service:AgendaService) { }

  ngOnInit() {
  }

}
