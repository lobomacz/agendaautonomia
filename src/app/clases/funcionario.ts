
export class Funcionario {
	foto:string;
	nombre:string;
	organizacion:string;
	cargo:string;
	municipio:string;
	//region:string;
	correo:string;
	telefono:string;
	movil:string;

	constructor (dato?:any, Foto:string = "assets/img/unknown-user.png"){
		if(dato != null){
			this.foto = dato.foto;
			this.nombre = dato.nombre;
			this.organizacion = dato.organizacion;
			this.cargo = dato.cargo;
			this.municipio = dato.municipio;
			this.correo = dato.correo;
			this.telefono = dato.telefono;
			this.movil = dato.movil;
		}else{
			this.foto = Foto;
			this.nombre = '';
		  	this.organizacion = '';
		  	this.cargo = '';
		  	//this.region = '';
		  	this.municipio = '';
		  	this.correo = '';
		  	this.telefono = '';
		  	this.movil = '';
		}
	}

	public ToJSon():any{
		return {
			"foto":this.foto,
			"nombre":this.nombre.toUpperCase(),
			"organizacion":this.organizacion,
			"cargo":this.cargo.toUpperCase(),
			"municipio":this.municipio,
			//"region":this.region,
			"correo":this.correo,
			"telefono":this.telefono,
			"movil":this.movil
		};
	}
}
