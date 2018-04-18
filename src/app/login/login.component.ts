import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';//28022018 Se removió FormsModule de los imports
import { AngularFireAuth } from 'angularfire2/auth';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
import * as firebase from 'firebase/app';


@Component({
  selector: 'macz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private usuario:boolean;

  constructor(private afAuth:AngularFireAuth, private router:Router) {
    
		this.revisaSesion();
  }

  ngOnInit() {

  }

  revisaSesion():any{

      this.usuario = false;

      let suscripcion = this.afAuth.authState.forEach(value => {
        console.log(value);
      });
  }

  loginCheck(event:any, loginform:NgForm):any{
    
    let valores:any = loginform.value;


    this.router.navigateByUrl('home');

    event.preventDefault();
  }

}
