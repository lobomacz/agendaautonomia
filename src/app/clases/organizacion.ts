export class Organizacion {
	nombre_corto:string;
	nombre_largo:string;
	direccion:string;
	municipio:string;
	nivel:string;
	//region:string;
	sitio:string;
	tipo:string;
	descripcion:string;
	telefono:string;

	constructor(datos?:any, _tipo:string = "publico"){

		if(datos != null){
			this.nombre_corto = datos.nombre_corto;
			this.nombre_largo = datos.nombre_largo;
			this.direccion = datos.direccion;
			this.municipio = datos.municipio;
			//this.region = datos.region;
			this.nivel = datos.nivel;
			this.tipo = datos.tipo;
			this.sitio = datos.sitio;
			this.descripcion = datos.descripcion || "";
			this.telefono = datos.telefono;
		}else{
			this.tipo = _tipo;
			this.direccion = "";
			this.descripcion = "";
			this.sitio = "";
		}
	}

	public ToJSon(){
		return {
			"nombre_corto": this.nombre_corto.toUpperCase(),
			"nombre_largo": this.nombre_largo.toUpperCase(),
			"direccion": this.direccion.toUpperCase(),
			"municipio": this.municipio,
			//"region": this.region,
			"nivel": this.nivel,
			"sitio": this.sitio.toLowerCase(),
			"tipo": this.tipo.toLowerCase(),
			"descripcion": this.descripcion.toUpperCase(),
			"telefono": this.telefono
		};
	}
}
