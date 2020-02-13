import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OpcionNav } from '../../clases/opcion-nav';

@Component({
  selector: 'macz-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	@Input() navitems:Array<OpcionNav>;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  OnItemClick(evento:any, ruta:string):void{

    this.router.navigateByUrl(ruta);

  	evento.preventDefault();
  }

}
