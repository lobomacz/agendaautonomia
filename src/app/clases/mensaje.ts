export class Mensaje {
	titulo:string;
	mensaje:string;
	icono:any;
	tipo:string;

	static T_MENSAJE = {T_ERROR:"error",T_INFO:"info",T_WARNING:"warning",T_QUESTION:"question"};

	constructor(titulo="", mensaje="",tipo="info"){
		this.titulo = titulo;
		this.mensaje = mensaje;
		this.tipo = tipo;
		this.icono = {info:"0",question:"~",warning:"G",error:"g"};
	}
}
