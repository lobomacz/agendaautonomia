import { Component, EventEmitter, OnInit, Input, Output, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OpcionNav } from '../../clases/opcion-nav';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../clases/usuario';
import { Funcionario } from '../../clases/funcionario';

import { ContactoService } from '../../servicios/contacto-service';
import { AuthserviceService } from '../../servicios/authservice.service';

@Component({
  selector: 'macz-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnChanges {

	@Input() usuarioId:string;
  @Output() logout = new EventEmitter();

  private usuario:Usuario;
  private funcionarioUsuario:Funcionario;
  private foto:string;
	private titulo_sitio:string;
	private link_list:Array<OpcionNav>;


  constructor(private router:Router, private route:ActivatedRoute, private _auth:AuthserviceService, private contactoService:ContactoService) {
  	
  	this.titulo_sitio = environment.sitetitle;
    this.link_list = null;
    this.usuario = null;
    this.funcionarioUsuario = null;
    this.foto = "./assets/img/unknown-user.png";

  }

  ngOnInit() {
  	 
  }

  ngOnChanges(changes:any) {
    this.Inicializa();
  }
  

  OnNavLink_Click(event:Event,ruta:string){

    if (ruta === 'logout') {
      let that = this;
      this._auth.Logout().then(() => {

        this.route.url.subscribe((p) => {
          if(p.length > 0){
            that.GoHome();
          }else{
            that.logout.emit();
          }
        });

      }).catch((error) => {
        const mensaje = error.message;
        let mensaje_error = `Ocurrió un problema al salir del sistema. Intentelo de nuevo. ${mensaje}`;
        alert(mensaje_error);
      });
      
    }else{
      this.router.navigateByUrl(ruta);
    }

    
    event.preventDefault();
  }

  GoHome(){
    this.router.navigateByUrl("/home");
  }

  Inicializa(){
    if(this.usuarioId != null){
      const _id:string = this.usuarioId;

      this._auth.GetUsuarioObservable('usuario', _id).subscribe((u) => {
        if(u.key !== null){
          this.usuario = new Usuario(u.payload.val());
          this.LlenaListaOpciones();
        }else{
          this._auth.GetUsuarioObservable('admin', _id).subscribe((v) => {
            
            this.usuario = new Usuario(v.payload.val());
            
            this.LlenaListaOpciones();
          });
        }
      });
    }else{
      this.usuario = null;
      this.funcionarioUsuario = null;
      this.LlenaListaOpciones();
    }
  }

  LlenaListaOpciones(){
    if(this.usuario !== null){
      
      switch (this.usuario.tipoUsuario) {
        case "admin":
          this.link_list = [
            {
              titulo:'Instituciones',icono:'&#xe028;',ruta:'instituciones'
            },
            {
              titulo:'Contactos',icono:'{',ruta:'contactos'
            },
            {
              titulo:'Proyectos',icono:'?',ruta:'proyectos'
            },
            {
              titulo:'Transferencias',icono:'o',ruta:'transferencias'
            },
            {
              titulo:'Reportes',icono:'&#xe00b;',ruta:'documentos'
            },
            {
              titulo:'Monitoreo',icono:'a',ruta:'monitoreo'
            }
          ];
          break;
        default:
            this.link_list = [
            {
              titulo:'Instituciones',icono:'&#xe028;',ruta:'instituciones'
            },
            {
              titulo:'Contactos',icono:'{',ruta:'contactos'
            },
            {
              titulo:'Reportes',icono:'&#xe00b;',ruta:'documentos'
            },
            {
              titulo:'Monitoreo',icono:'a',ruta:'monitoreo'
            }
          ];

          this.contactoService.GetContactoObservable(this.usuario.idFuncionario).subscribe((v) => {
            if (v !== null) {
              this.funcionarioUsuario = new Funcionario(v);
            }
          });
          break;
      }
       
    }else{
      this.link_list = null;
    }
  }

}
