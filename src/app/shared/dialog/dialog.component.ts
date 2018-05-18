import { Component, OnInit, Input } from '@angular/core';
import { Mensaje } from '../../clases/mensaje';

@Component({
  selector: 'macz-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

	@Input() mensaje:Mensaje;

  constructor() { }

  ngOnInit() {
  	
  }

}
