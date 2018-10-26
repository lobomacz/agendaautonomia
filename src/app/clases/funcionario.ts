
export class Funcionario {
	foto:string;
	nombre:string;
	organizacion:string;
	cargo:string;
	municipio:string;
	correo:string;
	telefono:string;
	movil:string;

	constructor (dato?:any, Foto:string = "assets/img/unknown-user.png"){
		if(dato != null){
			const {foto,nombre,organizacion,cargo,municipio,correo,telefono,movil} = dato;
			this.foto = foto;
			this.nombre = nombre;
			this.organizacion = organizacion;
			this.cargo = cargo;
			this.municipio = municipio;
			this.correo = correo;
			this.telefono = telefono;
			this.movil = movil;
		}else{
			this.foto = Foto;
			this.nombre = '';
		  	this.organizacion = '';
		  	this.cargo = '';
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
			"correo":this.correo,
			"telefono":this.telefono,
			"movil":this.movil
		};
	}
}
