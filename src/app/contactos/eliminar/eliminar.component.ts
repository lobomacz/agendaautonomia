import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'macz-eliminar',
  template: `
    <div class="dialog dialog--modal">
      <h3 class="dialog__titulo">Eliminar Contacto</h3>
      <p class="dialog__mensaje">
      </p>
    </div>
  `,
  styleUrls: ['./eliminar.component.scss']
})
export class EliminarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
