export class PersonalProyecto {

	public creole:number;
	public mestizo:number;
	public miskitu:number;
	public garifuna:number;
	public rama:number;
	public ulwa:number;
	public masculino:number;
	public femenino:number;

	constructor(datos?:any){
		if (datos != null) {
			this.creole = datos.creole ? datos.creole:0;
			this.mestizo = datos.mestizo ? datos.mestizo:0;
			this.miskitu = datos.miskitu ? datos.miskitu:0;
			this.garifuna = datos.garifuna ? datos.garifuna:0;
			this.rama = datos.rama ? datos.rama:0;
			this.ulwa = datos.ulwa ? datos.ulwa:0;
			this.masculino = datos.masculino ? datos.masculino:0;
			this.femenino = datos.femenino ? datos.femenino:0;
		}else{
			this.creole = 0;
			this.mestizo = 0;
			this.miskitu = 0;
			this.garifuna = 0;
			this.rama = 0;
			this.ulwa = 0;
			this.masculino = 0;
			this.femenino = 0;
		}
	}

	public ToJSon():any{
		return {
			"creole":this.creole,
			"mestizo":this.mestizo,
			"miskitu":this.miskitu,
			"garifuna":this.garifuna,
			"rama":this.rama,
			"ulwa":this.ulwa,
			"masculino":this.masculino,
			"femenino":this.femenino
		};
	}

}
