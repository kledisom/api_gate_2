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
   
for(let i = 0; i < convertArray2.length; i++) {
	 var array3 = convertArray2[i].toString().split(',');

	 // var espera = array3;

	   var sum1 = array3[0] * convertArray2.length;
	   var sum2 = array3[1] * convertArray2.length;
	   var sum3 = array3[2] * convertArray2.length;
	   var sum4 = array3[3] * convertArray2.length;
	   var sum5 = array3[4] * convertArray2.length;
	   var sum6 = array3[5] * convertArray2.length;
	   var sum7 = array3[6] * convertArray2.length;

	    console.log(sum1.toFixed(2));
	
  }
	 
//requisição a api da braspress

   let data = {"cnpjRemetente":42718567000148, 
   "cnpjDestinatario":42718567000148, 
   "modal":"R","tipoFrete":"1", 
   "cepOrigem":dadoTray.cep, 
    "cepDestino":dadoTray.cep_destino, 
    "vlrMercadoria":sum7, 
    "peso":sum5,"volumes":sum4, 
    "cubagem":[{"altura":sum2, 
    "largura":sum3, 
    "comprimento":sum1, 
    "volumes":sum4}]} 
          
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


 

