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
}
