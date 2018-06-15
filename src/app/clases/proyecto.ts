export class Proyecto {
	anio:string;
	id_organizacion:string;
	nombre:string;
	sector:string;
	objetivo:string;
	id_personal:string;
	cooperacion:number;
	tesoro:number;
	monto:number;
	municipio:string;
	comunidad:string;
	fecha_inicio:string;
	fecha_final:string;
	protagonistas:number;

	constructor(datos?:any) {
		if(datos != null){
			this.anio = datos.anio;
			this.id_organizacion = datos.id_organizacion;
			this.nombre = datos.nombre;
			this.sector = datos.sector;
			this.objetivo = datos.objetivo;
			this.id_personal = datos.id_personal;
			this.cooperacion = datos.cooperacion;
			this.tesoro = datos.tesoro;
			this.monto = datos.monto;
			this.municipio = datos.municipio;
			this.comunidad = datos.comunidad;
			this.fecha_inicio = datos.fecha_inicio;
			this.fecha_final = datos.fecha_final;
			this.protagonistas = datos.protagonistas;
		}else{
			let fecha = new Date();
			this.fecha_inicio = fecha.toDateString();
			this.fecha_final = fecha.toDateString();
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
			"nombre": this.nombre,
			"sector": this.sector,
			"objetivo": this.objetivo,
			"id_personal": this.id_personal,
			"cooperacion": this.cooperacion,
			"tesoro": this.tesoro,
			"monto": this.monto,
			"municipio": this.municipio,
			"comunidad": this.comunidad,
			"fecha_inicio": this.fecha_inicio,
			"fecha_final": this.fecha_final,
			"protagonistas": this.protagonistas
		};
	}
}
