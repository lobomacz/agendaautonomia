export class Usuario {

	idFuncionario:string;
	fechaIngreso:string;
	activo:boolean;
	tipoUsuario:string;
	ultimoIngreso:string;

	constructor(datos?:any, tipo:string = 'usuario'){
		if(datos != null){
			this.idFuncionario = datos.idFuncionario;
			this.fechaIngreso = datos.fechaIngreso;
			this.activo = datos.activo;
			this.ultimoIngreso = datos.ultimoIngreso;
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
			'ultimoIngreso':this.ultimoIngreso
		};
	}
}
