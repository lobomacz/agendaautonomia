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
    		titulo:'Contactos',icono:'o',ruta:'contactos'
    	},
    	{
    		titulo:'Documentos',icono:'N',ruta:'documentos'
    	},
    	{
    		titulo:'Instituciones',icono:'&#xe028;',ruta:'organizaciones'
    	},
      {
        titulo:'Proyectos',icono:'?',ruta:'proyectos'
      }
  	];
  }

  ngOnInit() {
  	
  }

  OnNavLink_Click(event:any,ruta:string){
    console.log(ruta);
    this.router.navigateByUrl(ruta);
    event.preventDefault();
  }

}
