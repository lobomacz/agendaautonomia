import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'macz-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

	@Input() page:number; 		// La pagina actual
	@Input() count:number;		// La cantidad de páginas 
	@Input() perPage:number;	// La cantidad de elementos por página
	@Input() pagesToShow:number;// La cantidad de páginas entre next y prev 
	@Input() loading:boolean;	// Revisa si el contenido se está cargando

	@Output() goNext = new EventEmitter<boolean>();
	@Output() goPrev = new EventEmitter<boolean>();
	@Output() goPage = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  getMin():number{
  	return ((this.perPage * this.page) - this.perPage) + 1;
  }

  getMax():number{
  	let max = this.perPage * this.page;

  	if(max > this.count){
  		max = this.count;
  	}

  	return max;
  }

  onPage(n:number):void{
  	this.goPage.emit(n);
  }

  onPrev():void{
  	this.goPrev.emit(true);
  }

  onNext(next:boolean):void{
  	this.goNext.emit(next);
  }

  totalPages():number{
  	return Math.ceil(this.count / this.perPage) || 0;
  }

  lastPage():boolean{
  	return this.perPage * this.page > this.count;
  }

  getPages():number[]{
  	const c = Math.ceil(this.count / this.perPage);
  	const p = this.page || 1;
  	const pagesToShow = this.pagesToShow || 9;
  	const pages:number[] = [];

  	pages.push(p);
  	const times = pagesToShow - 1;

  	for (let i = 0; i < times; i++){
  		if(pages.length < pagesToShow){
  			if (Math.min.apply(null, pages) > 1){
  				pages.push(Math.min.apply(null, pages) - 1);
  			}
  		}

  		if (pages.length < pagesToShow) {
  			if (Math.max.apply(null, pages) < c) {
  				pages.push(Math.max.apply(null, pages) + 1);
  			}
  		}
  	}

  	pages.sort((a, b) => a - b);
  	return pages;
  }

  


}
