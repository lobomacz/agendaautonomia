export class Proyecto {
	anio:string;
	tipo:string;
	id_organizacion:string;
	nombre:string;
	sector:string;
	objetivo:string;
	cooperacion:number;
	tesoro:number;
	monto:number;
	fechaInicio:string;
	fechaFinal:string;
	protagonistas:number;
	

	constructor(datos?:any) {
		if(datos != null){
			this.anio = datos.anio;
			this.tipo = datos.tipo;
			this.id_organizacion = datos.id_organizacion;
			this.nombre = datos.nombre;
			this.sector = datos.sector;
			this.objetivo = datos.objetivo;
			this.cooperacion = datos.cooperacion;
			this.tesoro = datos.tesoro;
			this.monto = datos.monto;
			this.fechaInicio = datos.fechaInicio;
			this.fechaFinal = datos.fechaFinal;
			this.protagonistas = datos.protagonistas;
			
		}else{
			let fecha = new Date();
			this.fechaInicio = fecha.toDateString();
			this.fechaFinal = fecha.toDateString();
			this.tipo = "publico";
			this.cooperacion = 0.00;
			this.tesoro = 0.00;
			this.monto = 0.00;
			this.protagonistas = 0.00;
			
		}
	}

	ToJSon():any{
		return {
			"anio": this.anio,
			"id_organizacion": this.id_organizacion,
			"nombre": this.nombre.toUpperCase(),
			"sector": this.sector,
			"objetivo": this.objetivo.toUpperCase(),
			"cooperacion": this.cooperacion,
			"tesoro": this.tesoro,
			"monto": this.monto,
			"fecha_inicio": this.fechaInicio,
			"fecha_final": this.fechaFinal,
			"protagonistas": this.protagonistas,
			"tipo": this.tipo.toLowerCase()
		};
	}
}
