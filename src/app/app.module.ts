import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgendaService } from './servicios/agenda.service';
import { InstitucionService } from './servicios/institucion-service';
import { ContactoService } from './servicios/contacto-service';
import { ProyectosService } from './servicios/proyectos-service';

import { CoreModule } from '../app/core/core.module';
import { ShellComponent } from '../app/core/shell/shell.component';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
  ],
  providers: [
    AgendaService,
    InstitucionService,
    ContactoService,
    ProyectosService
  ],
  bootstrap: [ShellComponent]
})
export class AppModule { }
