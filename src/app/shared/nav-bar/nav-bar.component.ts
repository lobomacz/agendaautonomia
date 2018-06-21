import { Component, OnInit, Input } from '@angular/core';
import { Router, Routes } from '@angular/router';
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


  constructor(private router:Router) {
  	
  	this.titulo_sitio = environment.sitetitle;

  	this.link_list = [
      {
        titulo:'Instituciones',icono:'&#xe028;',ruta:'instituciones'
      },
      {
        titulo:'Contactos',icono:'o',ruta:'contactos'
      },
      {
        titulo:'Proyectos',icono:'?',ruta:'proyectos'
      },
    	{
    		titulo:'Documentos',icono:'N',ruta:'documentos'
    	},
      {
        titulo:'Monitoreo',icono:'a',ruta:'monitoreo'
      }
  	];
  }

  ngOnInit() {
  	
  }

  OnNavLink_Click(event:any,ruta:string){
    this.router.navigateByUrl(ruta);
    event.preventDefault();
  }

  GoHome(){
    this.router.navigateByUrl("/");
  }

}
