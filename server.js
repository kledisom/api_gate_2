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
   // var sub = await str.replace(/,/g, ".");
    var convertArray =  str.split(";")
    //var convertArray = Array.from(arr); 
  
   //console.log(convertArray);

//requisição a api da braspress

   let data = {"cnpjRemetente":42718567000148, 
   "cnpjDestinatario":42718567000148, 
   "modal":"R","tipoFrete":"1", 
   "cepOrigem":dadoTray.cep, 
    "cepDestino":dadoTray.cep_destino, 
    "vlrMercadoria":convertArray[7], 
    "peso":convertArray[5],"volumes":convertArray[4], 
    "cubagem":[{"altura":convertArray[2], 
    "largura":convertArray[1], 
    "comprimento":convertArray[0], 
    "volumes":convertArray[4]}]} 
          
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


 
/* 
 function braspress(cep) { 
   let data = {"cnpjRemetente":60701190000104, 
     "cnpjDestinatario":30539356867, 
     "modal":"R","tipoFrete":"1", 
      "cepOrigem":2323000, 
      "cepDestino":cep, 
      "vlrMercadoria":100.00, 
      "peso":50.55,"volumes":10, 
      "cubagem":[{"altura":0.46, 
      "largura":0.67, 
      "comprimento":0.67, 
      "volumes":10}]} 
			
			 var authorizationBasic = 'Y2xpZW50ZTpjbGllbnRl'; 
				 fetch('https://api.braspress.com/v1/cotacao/calcular/json', { 
				  method: "POST", 
				  body: JSON.stringify(data), 
				  headers: {"Content-type": "application/json; charset=UTF-8", 
				      'Authorization': 'Basic ' + authorizationBasic, 
				  } 
				 }) 
			 .then(response => response.json()) 
			 .then(result => {
                console.log('ENVIADO', result)
            }) 
			 .catch(err => console.log(err)); 

 }  */
 



/*  function trayRes() { 

   var obj = {name: "Super", Surname: "Man", age: 23}; 

    var builder = new xml2js.Builder(); 
    var xml = builder.buildObject(obj); 

   console.log(xml); 
 }  */

 /* fetch('https://viacep.com.br/ws/01001000/json/') 
 .then(response => response.json()) 
 .then(result => console.log(result)) 
 .catch(err => console.log(err));  */