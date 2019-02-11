export class DocDefinition {

	public logo:string;
	public escudo:string;
	public logo_pie:string;
	public fecha:string;
	public annio:number;
	public contenido:any[];

	constructor(fecha:string,annio:number){
		
		this.fecha = fecha;
		this.annio = annio;

	}

	public setContent(content:any[]):void{
		this.contenido = content;
	}

	public setLogo(dataUrl:any):void{
		this.logo = dataUrl;
	}

	public setEscudo(dataUrl:any):void{
		this.escudo = dataUrl;
	}

	public setLogoPie(dataUrl:any):void{
		this.logo_pie = dataUrl;
	}

	public toJSON():any{
		return {
	    	header:{
		       columns:[
		        {
		        	image: this.escudo,
		        	width: 150,
		        	height: 40,
		          	margin:[10,20,40,10],

		        },
		        {
		            stack:[
		                'GOBIERNO REGIONAL AUTÓNOMO COSTA CARIBE SUR',
		                'Secretaría Regional de Planificación',
		            ],
		            bold:true,
		            fontSize:16,
		            alignment:'center',
		            margin: [0, 20, 40, 80],
		        }
		         ],
	      },
	      footer:{
	      	columns:[
	      		{
	      			stack:[
	      				'Oficina de Enlace en Managua, de la Región Autónoma del Caribe Sur.',
	      				'Residencial El Cortijo, de la gasolinera UNO, 50 vrs. Arriba, casa # 12.',
	      				'Teléfonos: 22669582 - 22500628'
	      			],
	      			style:'notaAlpie'
	      		},
	      		{
		        	image: this.logo_pie,
		        	width: 150,
		        	height: 50,
		          	margin:[0,0,20,0],
		          	alignment:'right'
		        }
	      	]
	      },
    	content: this.contenido,
    	styles:{
	          parrafo:{
	              margin:[10,20,0,20]
	          },
	          texto_derecha:{
	             margin:[0,10,0,10],
	             alignment:'right'
	          },
	          texto_centrado:{
	          	alignment:'center'
	          },
	          encabezado:{
	            fontSize:18,
	            bold:true,
	            margin:[20,20]
	          },
	          encabezado2:{
	            fontSize:17,
	            bold:false,
	            margin:[0,25,0,15],
	            alignment:'center'
	          },
	          encabezadoTabla:{
	          	fontSize:14,
	          	bold:true,
	          	color:'black'
	          },
	          celdaMoneda:{
	          	alignment:'right',
	          	bold:true
	          },
	          celdaMonedaTotal:{
	          	fontSize:16,
	          	alignment:'right',
	          	bold:true
	          },
	          notaAlpie:{
	          	fontSize:8,
	          	margin:[20,10],
	          	alignment:'left'
	          }
	      },
	      pageSize: 'LETTER',
	      pageOrientation: 'portrait',
	      pageMargins: [40,60],
	    };
	}
}
