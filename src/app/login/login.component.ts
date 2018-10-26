import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';//28022018 Se removió FormsModule de los imports
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';

import { AuthserviceService } from '../servicios/authservice.service';

import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'macz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private correo:string;
  private contrasena:string;

  constructor(private router:Router, private _auth:AuthserviceService, private route:ActivatedRoute) {
    //this.ruta = this.route.snapshot.paramMap.get('origen');
    this.correo = ""; //"Correo-e";
    this.contrasena = ""; //"Contraseña";
  }

  ngOnInit() {

  }

  LoginCheck(event:Event):any{
    
    event.preventDefault();
    let that = this;

    this._auth.Login(this.correo, this.contrasena).then((cred) => {

      if (cred != null) {
        const ruta:string = '/home';
        this.router.navigateByUrl(ruta);
      }

    }).catch((error) => {
      let errorMessage = error.message; 
      let errorCode = error.code;
      alert("Error ".concat(errorMessage, " Codigo: ", errorCode));
    });
  }

}
