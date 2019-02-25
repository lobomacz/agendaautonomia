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

  public correo:string;
  public contrasena:string;
  public showDialog:boolean;
  public titulo_dialogo:string;
  public texto_dialogo:string;

  constructor(private router:Router, private _auth:AuthserviceService, private route:ActivatedRoute) {
    //this.ruta = this.route.snapshot.paramMap.get('origen');
    this.correo = ""; //"Correo-e";
    this.contrasena = ""; //"Contraseña";
    this.showDialog = false;
  }

  ngOnInit() {

    this.titulo_dialogo = '';
    this.texto_dialogo = '';
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
      let titulo = '';
      let mensaje = '';

      switch (error.code) {
        case "auth/invalid-email":
          titulo = 'Correo No Válido';
          mensaje = 'La dirección de correo ingresada NO es válida. Verifique y vuelva a intentarlo.';
          break;
        case "auth/user-disabled":
          titulo = 'Usuario Desactivado';
          mensaje = 'Su cuenta de usuario ha sido desactivada. Contacte al administrador de la plataforma.';
          break;
        case "auth/user-not-found":
          titulo = 'Usuario Desconocido';
          mensaje = 'El correo ingresado no corresponde a ninguna cuenta de usuario conocida. Verifique y vuelva a intentarlo.';
          break;
        default:
          titulo = 'Contraseña Incorrecta';
          mensaje = 'La contraseña ingresada no es correcta. Por favor, verifique y vuelva a intentarlo.';
          break;
      }

      this.titulo_dialogo = titulo;
      this.texto_dialogo = mensaje;
      this.showDialog = true;

    });
  }

  CierraDialogo(){
    this.showDialog = false;
    this.titulo_dialogo = '';
    this.texto_dialogo = '';
  }

}
