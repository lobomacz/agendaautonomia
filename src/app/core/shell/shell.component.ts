import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'macz-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

	private titulo1:String;
	private titulo2:String;

  constructor() { 
  	this.titulo1 = environment.sitetitle1;
  	this.titulo2 = environment.sitetitle2;
  }

  ngOnInit() {
  }

}
