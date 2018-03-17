import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';//28022018 Se removió FormsModule de los imports
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';


@Component({
  selector: 'macz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private titulo1:String;
  private titulo2:String;

  constructor(private afAuth:AngularFireAuth, private router:Router) {
    this.titulo1 = environment.sitetitle1;
    this.titulo2 = environment.sitetitle2;
    
		this.revisaSesion();
  }

  ngOnInit() {

  }

  revisaSesion():any{
      let suscripcion = this.afAuth.authState.forEach(value => {
        console.log(value);
      });
  }

  loginCheck(event:any, loginform:NgForm):any{
    
    let valores:any = loginform.value;

    console.log(valores.correo);

    this.router.navigateByUrl('home');

    event.preventDefault();
  }

}
