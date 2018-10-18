export class Usuario {

	idFuncionario:string;
	fechaIngreso:string;
	activo:boolean;
	tipoUsuario:string;
	ultimoIngreso:string;
	email:string;
	uid:string;

	constructor(datos?:any, tipo:string = 'usuario'){
		if(datos != undefined){
			const {idFuncionario,fechaIngreso,activo,ultimoIngreso,email,uid,tipoUsuario} = datos;

			this.idFuncionario = idFuncionario;
			this.fechaIngreso = fechaIngreso;
			this.activo = activo;
			this.ultimoIngreso = ultimoIngreso;
			this.tipoUsuario = tipoUsuario;
			this.email = email;
			this.uid = uid;

		}else{
			this.idFuncionario = '';
			this.fechaIngreso = new Date().toDateString();
			this.ultimoIngreso = this.fechaIngreso;
			this.tipoUsuario = tipo;
			this.activo = false;
		}

		this.tipoUsuario = tipo;
	}

	public ToJSon(){
		return {
			'idFuncionario':this.idFuncionario,
			'fechaIngreso':this.fechaIngreso,
			'activo':this.activo,
			'ultimoIngreso':this.ultimoIngreso,
			'tipoUsuario':this.tipoUsuario,
			'email':this.email,
			'uid':this.uid
		};
	}
}
