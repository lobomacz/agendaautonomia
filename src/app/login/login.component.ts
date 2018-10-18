import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';//28022018 Se removió FormsModule de los imports
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';

import { AuthserviceService } from '../servicios/authservice.service';

import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'macz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private ruta:string;

  constructor(private router:Router, private _auth:AuthserviceService, private route:ActivatedRoute) {
    this.ruta = this.route.snapshot.paramMap.get('ruta');
  }

  ngOnInit() {

  }

  revisaSesion():boolean{
    let res:boolean = false;

    if(this._auth.GetUsuario().uid != undefined){
      res = true;
    }

    return res;
  }

  loginCheck(event:any, loginform:NgForm):any{
    
    let valores:any = loginform.value;

    this._auth.Login(valores.correo, valores.password);

    if (this.revisaSesion() === true) {
      this.router.navigateByUrl(this.ruta);
    }else{
      //CODIGO PARA MOSTRAR ERROR DE VALIDACION
    }
    

    event.preventDefault();
  }

}
