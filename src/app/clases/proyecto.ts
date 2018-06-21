export class Proyecto {
	anio:string;
	tipo:string;
	id_organizacion:string;
	nombre:string;
	sector:string;
	objetivo:string;
	personal:any;
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
			this.tipo = datos.tipo;
			this.id_organizacion = datos.id_organizacion;
			this.nombre = datos.nombre;
			this.sector = datos.sector;
			this.objetivo = datos.objetivo;
			this.personal = datos.personal;
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
			this.tipo = "gobierno";
			this.cooperacion = 0.00;
			this.tesoro = 0.00;
			this.monto = 0.00;
			this.protagonistas = 0.00;
			this.personal = {"masculino":0,"femenino":0,"mestizo":0,"creole":0,"miskitu":0,"rama":0,"ulwa":0,"garifuna":0};
		}
	}

	ToJSon():any{
		return {
			"anio": this.anio,
			"id_organizacion": this.id_organizacion,
			"nombre": this.nombre.toUpperCase(),
			"sector": this.sector,
			"objetivo": this.objetivo,
			"personal": this.personal,
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
