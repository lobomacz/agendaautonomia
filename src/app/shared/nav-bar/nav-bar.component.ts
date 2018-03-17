import { Component, OnInit, Input } from '@angular/core';
import { OpcionNav } from '../../clases/opcion-nav';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'macz-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

	@Input() usuario:boolean;
	private titulo_sitio:string;
	private link_list:Array<OpcionNav>;


  constructor() {
  	
  	this.titulo_sitio = environment.sitetitle;

  	this.link_list = [
  	{
  		titulo:'Contactos',icono:'o',ruta:'/contactos'
  	},
  	{
  		titulo:'Documentos',icono:'N',ruta:'/documentos'
  	},
  	{
  		titulo:'Instituciones',icono:'&#xe028;',ruta:'/instituciones'
  	}
  	];
  }

  ngOnInit() {
  	
  }

}
