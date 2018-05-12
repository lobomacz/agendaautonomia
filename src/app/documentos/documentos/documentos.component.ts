import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'macz-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

	@Input() private usuario:boolean;

  constructor() { }

  ngOnInit() {
  }

}
