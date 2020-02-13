import { Component, OnInit } from '@angular/core';
import { Usuario } from '../clases/usuario';
import { AuthserviceService } from '../servicios/authservice.service';

@Component({
  selector: 'macz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	
  public usuarioId:string;
  
  constructor(private _auth:AuthserviceService) {
    
  }

  ngOnInit() {
    this.usuarioId = this._auth.AuthUser() !== null ? this._auth.AuthUser().uid:null;
  }

  userLogout(){
    this.usuarioId = null;
  }

}
