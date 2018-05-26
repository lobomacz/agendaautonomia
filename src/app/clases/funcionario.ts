
export class Funcionario {
	foto:string;
	nombre:string;
	organizacion:string;
	cargo:string;
	municipio:string;
	region:string;
	correo:string;
	telefono:string;
	movil:string;

	constructor (Foto:string = "assets/img/unknown-user.png"){
		this.foto = Foto;
	}

	public Populate(datos:any){
		if(datos!=null){
			this.foto = datos.foto;
			this.nombre = datos.nombre;
			this.organizacion = datos.organizacion;
			this.cargo = datos.cargo;
			this.municipio = datos.municipio;
			this.region = datos.region;
			this.correo = datos.correo;
			this.telefono = datos.telefono;
			this.movil = datos.movil;
		}
	}

	public ToJSon():any{
		return {
			"foto":this.foto,
			"nombre":this.nombre.toUpperCase(),
			"organizacion":this.organizacion,
			"cargo":this.cargo.toUpperCase(),
			"municipio":this.municipio,
			"retion":this.region,
			"correo":this.correo,
			"telefono":this.telefono,
			"movil":this.movil
		};
	}
}
