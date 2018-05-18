import { Component, OnInit } from '@angular/core';
import { OpcionMenu } from '../clases/opcion-menu';
import { OpcionNav } from '../clases/opcion-nav';

@Component({
  selector: 'macz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	
  private menuPrincipal:Array<OpcionMenu>;
  private menuNav:Array<OpcionNav>;

  constructor() {

    this.menuPrincipal = new Array<OpcionMenu>();
    this.menuPrincipal.push({titulo:'contactos',ruta:'contactos'});
    this.menuPrincipal.push({titulo:'programas',ruta:'programas'});
    this.menuPrincipal.push({titulo:'documentos',ruta:'documentos'});

    this.menuNav = new Array<OpcionNav>();
    this.menuNav.push({titulo:'ajustes',icono:'',ruta:'ajustes'});
    this.menuNav.push({titulo:'salir',icono:'',ruta:'logout'});

  }

  ngOnInit() {
  }

  OnMenuClick(evento:any, ruta:string):void{
    console.log(ruta);

    evento.preventDefault();
  }

}
