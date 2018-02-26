export class Funcionario {
	foto:string;
	nombre:string;
	organizacion:string;
	cargo:string;
	municipio:string;
	region:number;
	correo:string;
	telefono:string;
	movil:string;

	constructor (Nombre:string,Org:string,Cargo:string,Muni:string,Region:number,Correo:string,Telefono:string,Movil:string,Foto:string = "assets/img/unknown-user.png"){
		this.foto = Foto;
		this.nombre = Nombre;
		this.organizacion = Org;
		this.cargo = Cargo;
		this.municipio = Muni;
		this.region = Region;
		this.correo = Correo;
		this.telefono = Telefono;
		this.movil = Movil;
	}
}
