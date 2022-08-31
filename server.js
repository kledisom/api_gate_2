 const express = require('express'); 
 const bodyParser = require('body-parser');  
 var cors = require('cors'); 
 const fetch = require('node-fetch')
 var xml2js = require('xml2js'); 
 var port = process.env.PORT || 3000;
 const app = express(); 


 app.use(cors()); 

 app.use(bodyParser.json()); 
 // Express modules / packages 

 app.use(bodyParser.urlencoded({ extended: true })); 
 // Express modules / packages 

 app.use(express.static('public')); 
 // load the files that are in the public directory 


 app.get('/', (req, res) => { 
  const status = {message: "working", code: "200"};
   res.send(status) 
 }); 

 app.get('/user', async (req, res) => {

//## Consulta a api da braspress;
    var dadoTray = {
        cep: req.query.cep,
        cep_destino: req.query.cep_destino,
        prods: req.query.prods,
    }

//tratamento da cubagem
    const str = dadoTray.prods;

    var convertArray1 =  str.split(";");

    var convertArray2 = convertArray1.toString().split('/');

    //var convertArray3 = convertArray2.toString().split(',');
   
const arrayMain0 = [];
const arrayMain1 = [];
const arrayMain2 = [];
const arrayMain3 = [];
const arrayMain4 = [];
const arrayMain5 = [];
const arrayMain6 = [];
	 
	 
for(let i = 0; i < convertArray2.length; i++) {
	 var array3 = convertArray2[i].toString().split(',');

	  var volumes = parseInt(array3[4]); //quantidade unitaria
	
	   var sum1 = parseFloat(array3[0]) * volumes;//comp
	   var sum2 = parseFloat(array3[1]) * volumes;//lar
	   var sum3 = parseFloat(array3[2]) * volumes;//alt
	   var sum4 = parseFloat(array3[5]) * volumes;//peso
	   var sum5 = parseFloat(array3[6]) * volumes;// cod do pr
	   var sum6 = parseFloat(array3[7]) * volumes;//valor unitario

	//Armazenar dados em um array externo
		arrayMain0.push(volumes);
		arrayMain1.push(sum1);	  
		arrayMain2.push(sum2);	 
		arrayMain3.push(sum3);	 
		arrayMain4.push(sum4);	 
		arrayMain5.push(sum5);	 
		arrayMain6.push(sum6);	 
	
  }
	 
		var arrayD0 = arrayMain0.reduce((total, num) => total + num, 0);
		var arrayD1 = arrayMain1.reduce((total, num) => total + num, 0);
		var arrayD2 = arrayMain2.reduce((total, num) => total + num, 0);
		var arrayD3 = arrayMain3.reduce((total, num) => total + num, 0);
		var arrayD4 = arrayMain4.reduce((total, num) => total + num, 0);
		var arrayD5 = arrayMain5.reduce((total, num) => total + num, 0);
		var arrayD6 = arrayMain6.reduce((total, num) => total + num, 0);
	  	 
	 
 
//requisição a api da braspress

   let data = {"cnpjRemetente":42718567000148, 
   "cnpjDestinatario":42718567000148, 
   "modal":"R","tipoFrete":"1", 
   "cepOrigem":dadoTray.cep, 
    "cepDestino":dadoTray.cep_destino, 
    "vlrMercadoria":arrayD6, 
    "peso":arrayD4,"volumes":1, 
    "cubagem":[{"altura":arrayD3, 
    "largura":arrayD2, 
    "comprimento":arrayD1, 
    "volumes":1}]} 
          
           var authorizationBasic = 'Y2xpZW50ZTpjbGllbnRl'; 
            var response = await fetch('https://api.braspress.com/v1/cotacao/calcular/json', { 
                method: "POST", 
                body: JSON.stringify(data), 
                headers: {"Content-type": "application/json; charset=UTF-8", 
                    'Authorization': 'Basic ' + authorizationBasic, 
                } 
               }) 
           .then(response => response.json()) 
           //console.log(response.id)
         

           const id = response.id; 
           const prazo = response.prazo; 
           const totalFrete = response.totalFrete; 

//objeto para ser convertido em XML
          var obj = {
            "cotacao": {
              "resultado": {
                "codigo": id,
                "transportadora": "BRASPRESS",
                "servico": "",
                "transporte": "TERRESTRE",
                "valor": totalFrete,
                "peso": 5.334,
                "prazo_min": prazo,
                "prazo_max": prazo,
                "imagem_frete": "https://www.braspress.com/wp-content/themes/braspress/img/braspress-logo.png",
                "aviso_envio": "",
                "entrega_domiciliar": 1
              }
            }
          }


//### Convete o json em XML e retorna
          var builder = new xml2js.Builder(); 
          var xml = builder.buildObject(obj); 
      
        //console.log(xml); 
    
        res.set('Content-Type', 'text/xml');

     return res.send(xml);   

 }) 


 app.listen(port, () => { // Listen on port 3000 
   console.log('Listening! in port: ', port) // Log when listen success 
 });


 

