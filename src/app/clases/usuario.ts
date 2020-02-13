export class Usuario {

	idFuncionario:string;
	fechaIngreso:string;
	activo:boolean;
	tipoUsuario:string;
	ultimoIngreso:string;

	constructor(datos?:any, tipo:string = 'usuario'){
		if(datos != undefined){
			const {idFuncionario,fechaIngreso,activo,ultimoIngreso,tipoUsuario} = datos;

			this.idFuncionario = idFuncionario;
			this.fechaIngreso = fechaIngreso;
			this.activo = activo;
			this.ultimoIngreso = ultimoIngreso;
			this.tipoUsuario = tipoUsuario;

		}else{
			this.idFuncionario = '';
			this.fechaIngreso = new Date().toDateString();
			this.ultimoIngreso = this.fechaIngreso;
			this.tipoUsuario = tipo;
			this.activo = false;
		}
	}

	public ToJSon(){
		return {
			'idFuncionario':this.idFuncionario,
			'fechaIngreso':this.fechaIngreso,
			'activo':this.activo,
			'ultimoIngreso':this.ultimoIngreso,
			'tipoUsuario':this.tipoUsuario,
		};
	}
}
