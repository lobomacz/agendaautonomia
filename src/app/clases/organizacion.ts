export class Organizacion {
	nombre:string;
	direccion:string;
	municipio:string;
	nivel:string;
	region:string;
	sitio:string;
	tipo:string;
	descripcion:string;
	telefono:string;

	constructor(datos?:any, _tipo:string = "gobierno"){

		if(datos != null){
			this.nombre = datos.nombre;
			this.direccion = datos.direccion;
			this.municipio = datos.municipio;
			this.region = datos.region;
			this.nivel = datos.nivel;
			this.tipo = datos.tipo;
			this.sitio = datos.sitio;
			this.descripcion = datos.descripcion;
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
			"nombre": this.nombre.toUpperCase(),
			"direccion": this.direccion.toUpperCase(),
			"municipio": this.municipio,
			"region": this.region,
			"nivel": this.nivel,
			"sitio": this.sitio.toLowerCase(),
			"tipo": this.tipo.toLowerCase(),
			"descripcion": this.descripcion.toUpperCase(),
			"telefono": this.telefono
		};
	}
}
