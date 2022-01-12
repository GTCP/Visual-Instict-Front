"use strict"

    //-----PARTIAL RENDER-----//
    let urlHome = "home.html"
    let urlGallery = "gallery.html"
    let urlSocial = "social.html"

    //CARGA EN EL DOM EL HOME
    let all = document.querySelector(".cargarAll");
    cargarHome(); 
    document.querySelector(".js-home").addEventListener('click', cargarHome);
    async function cargarHome(){
        all.innerHTML = "<h1>Loading...</h1>";
        try {
            let promesa = await fetch(urlHome);
            if (promesa.ok){
                let respuesta = await promesa.text();
                if (respuesta){
                    all.innerHTML = respuesta;
                    //ESTOS HACEN QUE SE VEAN LAS PUBLICIDADES CUANDO ENTRA EN HOME/GALLERY ETC
                    document.querySelector(".publicidadSecundaria1").style.display = "block";
                    document.querySelector(".publicidadSecundaria2").style.display = "block";
                }
            }
        } catch (error) {
            all.innerHTML = "<h1>Error - Conection Failed!</h1>";
        }
    }
    //CARGA EN EL DOM EL GALLERY
    document.querySelector(".js-gallery").addEventListener('click', function(){ 
        //ESTOS HACEN QUE SE VEAN LAS PUBLICIDADES CUANDO ENTRA EN HOME/GALLERY ETC
        document.querySelector(".publicidadSecundaria1").style.display = "block";
        document.querySelector(".publicidadSecundaria2").style.display = "block";
        carGallery();
        //FUNCION ASINCRONICA DONDE SE HACE TODO
        async function carGallery(){
            all.innerHTML = "<h1> Loading... </h1>";
            try {
                let promesa = await fetch (urlGallery); //RENDER GALLRY
                if (promesa.ok) {
                let respuesta = await promesa.text();
                    if (respuesta) { //SI SE CARGO LA GALERIA HACE TODO LO DEMAS
                        all.innerHTML = respuesta; 
                        //URL'S
                        let baseURL = "http://web-unicen.herokuapp.com/api/groups/";
                        let url = baseURL +"53/entrega"

                        //TRAE LA TABLA DEL DOM
                        let tBody = document.getElementById("tCuerpo");//trae del DOM el tCuerpo
                    
                        let table = [];

                        let jUsuario = {
                            "type" : " ",
                            "quality" : " ",
                            "quantity" : " ",
                            "total" : " "
                        }

                        let pTable = false; //habilita a pintar la tabla

                        //HACE EL GET PARA QUE APAREZCA LA TABLA NI BIEN ENTRAS A LA GALERIA
                        getServidor();
                        autoRefresh();
                        function autoRefresh(){
                            setInterval(function(){
                                while(tBody.lastChild){
                                    tBody.removeChild(tBody.lastChild);
                                }
                                getServidor();
                            }, 10000);
                        }
                        let add = document.getElementById("add"); //trae el boton añadir compra
                        add.addEventListener("click", function(){
                                jUsuario = creaJson();
                                for (let i = 0; i < 3; i++) { 
                                    let objeto = { //LO GUARDO EN UN THING
                                        "thing" :   jUsuario
                                    }
                                    table[table.length] = objeto; //EN LA ULTIMIA POSICION QUE SE CREA EN EL ARREGLO GUARDO EL OBJETO                                  
                                    postServidor(objeto);
                                }
                            
                        }); //le da evento al boton añadir

                        //EVENTO DE LA TABLA DEL FILTRO
                        let btnFilter = document.getElementById("filter");
                        btnFilter.addEventListener("click", function(){
                            let filtro = document.getElementById("form-type-filter").value;
                            let arrFiltro= []; //CREO UN ARREGLO AUXILIAR PARA QUE PUEDA IMPRIMIR TODO
                            for (let i = 0; i < table.length; i++) {
                                if (table[i].thing.type==filtro) {
                                    arrFiltro[arrFiltro.length] = table[i]; //LLENA EL ARREGLO DEL FILTRO
                                }
                            }
                            tBody = document.getElementById("tFiltro");
                            imprimeTabla(arrFiltro); //IMPRIME LA TABLA FILTRADO
                            setTimeout(function(){ //DESPUES DE 1 MINUTO BORRA LA TABLA
                                while (tBody.lastChild) {
                                    tBody.removeChild(tBody.lastChild);
                                }
                                arrFiltro = [];
                                }, 30000);
                            tBody = document.getElementById("tCuerpo"); 
                        })
                        //EVENTO QUE AÑADE UNA FILA SOLA A LA TABLA 
                        let adduno = document.getElementById("adduno"); //trae el boton añadir compra
                        adduno.addEventListener("click", function(){
                                jUsuario = creaJson(); //CREO EL JSON QUE EL USUARIO CARGO
                                let objeto = { //LO GUARDO EN UN THING
                                    "thing" :   jUsuario}
                                table[table.length] = objeto; //EN LA ULTIMIA POSICION QUE SE CREA EN EL ARREGLO GUARDO EL OBJETO
                                postServidor(objeto); //LO GUARDO EN EL SERVIDOR
                            
                        });
                        //EVENTO QUE QUITA DE A UNO LOS ELEMENTOS DEL ARREGLO Y DEL SERVIDOR
                        let quit = document.getElementById("quit");// trae el boton 
                        quit.addEventListener("click", function(){
                            delleteServidor();
                            async function delleteServidor(){
                                try {
                                    let promesa = await fetch(url);//HACE UN GET
                                    if (promesa.ok){
                                        let respuesta = await promesa.json();
                                        if (respuesta){ //SI TODO ESTA EN ORDEN HACE EL DELLETE SEGUN LA ULTIMA POSICION DEL ARREGLO
                                            let promesa = await fetch(url+"/"+respuesta.entrega[respuesta.entrega.length-1]._id, {"method": 'DELETE'
                                            });
                                            let r = await promesa.json(); 
                                            if (r){ //BORRA LA ULTIMA FILA DE LA TABLA Y LA ULTIMA POS DEL ARREGLO
                                                tBody.removeChild(tBody.lastChild);
                                                table.pop();
                                            }
                                        }
                                    }
                                } catch (error) {
                                    alert("Fallo el servidor "+error);
                                }
                            }
                        });


                        //HACE EL POST EN EL SERVIDOR
                        async function postServidor(objeto){
                            let muestraEstado = document.querySelector(".estado");
                            muestraEstado.innerHTML= "<h2>Guardando...</h2>"
                            try {
                                let respuesta = await fetch(url, { 
                                method : "POST",
                                headers :{
                                    'Content-type': 'application/json'
                                },
                                body: JSON.stringify(objeto)});
                                if (respuesta.ok){
                                    muestraEstado.innerHTML = "<h2>Guardado con exito</h2>";
                                    imprimeUnElemento(objeto, table.length);
                                }
                                
                            } catch (error) {
                                muestraEstado.innerHTML = "<h2>Error del servidor</h2>";
                            }
                        
                        }
                        //TRAE DEL SERVIDOR EL ARREGLO
                        async function getServidor(){
                            try {
                                let promesa = await fetch(url);
                                if (promesa.ok){
                                    let respuesta = await promesa.json();
                                    if (respuesta){
                                        for (let i = 0; i< respuesta.entrega.length; i++){//RECORRE EL ARREGLO DEL SERVIDOR
                                            table[i] = respuesta.entrega[i]; //LLENA EL ARREGLO DE JS
                                        }
                                        imprimeTabla(table); //IMPRIME LA TABLA
                                    }
                                }
                            } catch (error) {
                                alert("Fallo el servidor "+error);
                            }
                        }
                        //IMPRIME TODA LA TABLA SEGUN EL ARREGLO QUE LE PASES  
                        function imprimeTabla(arr){  
                            for (let i = 0; i < arr.length; i++) {
                                imprimeUnElemento(arr[i]);
                            }
                        }

                        //IMPRIME UN OBJETO SEGUN SEA PASADO
                        function imprimeUnElemento(objeto) { 
                            let row = document.createElement("tr");
                            let col;
                            for (let j = 0; j < 4; j++) {
                                col = document.createElement("td");
                                let txtCol = document.createTextNode(sColumna(objeto.thing, j));
                                col.appendChild(txtCol);
                                row.appendChild(col);
                            }     
                            btnEditar(col, row, objeto._id);
                            btnBorrar(col, row, objeto._id);
                            if (pTable==true){
                                row.classList.add("resaltado");
                                pTable = false;
                            }
                            tBody.appendChild(row);
                        }   
                        //CREA EL BOTON DE EDITAR Y LE DA UN EVENTO 
                        function btnEditar(col, row, id){
                            col = document.createElement("td");                   
                            let editar = document.createElement("button");
                            editar.innerHTML = "Editar";
                            editar.classList.add("btnEditar", id, "rounded");
                            col.appendChild(editar)
                            row.appendChild(col);
                            editar.addEventListener("click", function(){
                                editar();
                            async function editar(){
                                jUsuario =  creaJson();
                                let objeto = {
                                    "thing" : jUsuario
                                }
                                let promesa = await fetch(url+"/"+id, {
                                    method: 'PUT', "headers": { "Content-Type": "application/json" },
                                    "body": JSON.stringify(objeto)
                                });
                                let respuesta = await promesa;
                                if (respuesta){
                                    while (tBody.lastChild){ 
                                        tBody.removeChild(tBody.lastChild);
                                    }
                                    table=[];
                                    getServidor();
                                }

                            }
                            });
                        }

                        //CREA EL BOTON BORRAR Y LE DA UN EVENTO
                        function btnBorrar(col, row, id){
                            col = document.createElement("td"); 
                            let borrar = document.createElement("button");  
                            borrar.classList.add("btnBorrar", id, "rounded");
                            borrar.innerHTML = "Borrar"; 
                            col.appendChild(borrar)
                            row.appendChild(col);
                            borrar.addEventListener("click", function(){
                                dellete();
                                async function dellete(){
                                    try {
                                        let promesa = await fetch(url);
                                        if (promesa.ok){
                                            let respuesta = await promesa.json();
                                            if (respuesta){
                                                let promesa = await fetch(url+"/"+id, {"method": 'DELETE'
                                                });
                                                let r = await promesa.json(); 
                                                if (r){
                                                    while (tBody.lastChild){ 
                                                        tBody.removeChild(tBody.lastChild);
                                                    }
                                                    table=[];
                                                    getServidor();
                                                }
                                            }
                                        }
                                    } catch (error) {
                                        alert("Fallo el servidor "+error);
                                    }
                                }

                            })
                        }

                        //CREA EL JSON TRAIDO DEL DOM
                        function creaJson(){ //devuelve el objeto ya cargado por el usuario
                            jUsuario.type = document.getElementById("form-type").value;
                            jUsuario.quality = document.getElementById("form-quality").value;
                            jUsuario.quantity =  document.getElementById("form-quantity").value;
                            jUsuario.total = '$'+ descuento(jUsuario, jUsuario.quantity);
                            return jUsuario;
                        }
                        
                        //SEGUN EL VALOR DEL OBJETO RETORNA LO QUE HAY ADENTRO
                        function sColumna(objet, contador){
                            let valor;
                            switch(contador){
                                case 0:
                                    valor = objet.type;
                                break;
                                case 1:
                                    valor = objet.quality;
                                break;
                                case 2:
                                    valor = objet.quantity;
                                break;
                                case 3:
                                    valor = objet.total;
                                break;
                            }
                            if (objet.quantity>=10){
                                pTable = true; //habilita a pintar la fila
                            }
                            return valor;
                        }
                    
                        //HACE EL DESCUENTO SEGUN
                        function descuento(objet, entero) {
                            let aux = sumaTotal(objet, entero);
                            if (entero>=10){//es decir si compra mas de se le hace descuento y se pinta la fila
                                aux = aux-(aux/20);//genera el descuento del precio
                                return aux+"(-25%)";//devuelve un string agregando el descuento
                            }else{
                                return aux;
                            }
                        }

                        //DEVUELVE EL VALOR DEL PRECIO
                        function sumaTotal(objet, cantidad){ 
                            let total;
                            switch (objet.type){
                                case 'Montage': 
                                    switch (objet.quality){
                                        case 'FullHD':
                                            total = cantidad*100;
                                        break;
                                        case 'HD':
                                            total = cantidad*70;
                                        break;
                                        case 'Medium':
                                            total = cantidad*65;
                                        break;
                                    }
                                break;
                                case 'Arquitectura':
                                    switch (objet.quality){
                                        case 'FullHD':
                                            total = cantidad*50;
                                        break;
                                        case 'HD':
                                                total = cantidad*35;
                                        break;
                                        case 'Medium':
                                                total = cantidad*30;
                                        break;
                                    }
                                break;
                                    case 'Portrait':
                                        switch (objet.quality){
                                            case 'FullHD':
                                                total = cantidad*40;
                                            break;
                                            case 'HD':
                                                total = cantidad*35;
                                            break;
                                            case 'Medium':
                                                total = cantidad*30;
                                            break;
                                            }
                                    break;
                            }
                            return total;
                        }
                    }
                }
            }
            catch (error) {
                all.innerHTML = "<h1>Error - Conection Failed!</h1>"+error;
            }
        }
      

    }); 
    
    //CARGA EN EL DOM EL SOCIAL
    document.querySelector(".js-social").addEventListener('click', function(){
        cargaSocial();
        document.querySelector(".publicidadSecundaria1").style.display = "none";
        document.querySelector(".publicidadSecundaria2").style.display = "none";
        async function cargaSocial(){
            all.innerHTML = "<h1> Loading... </h1>";
            try {
                let promesa = await fetch (urlSocial);
                if (promesa.ok) {
                    let respuesta = await promesa.text();
                    if (respuesta) {
                        all.innerHTML = respuesta;

                        let random = document.getElementById("random");
                        let result = numero();
                        //---------captcha--------//
                        let botonformulario = document.getElementById("botonformulariohtml");
                        botonformulario.addEventListener("click",function(e){
                            comparar();
                        });        
                
                        function numero() { // devuelve numero random
                            let  res =  Math.floor(Math.random()* (1000-100));
                            if (res<100)
                                res = res+100;     
                            random.innerHTML = res;
                            return res;
                        }
                
                        function comparar(){
                        let input = document.getElementById("idcaptcha").value;
                            if ((result == input)){
                                document.getElementById("botonformulariohtml").style.display = "none";
                                alert("En breve sera atendido,vuelva pronto");
                            }
                            else{
                            alert("Usted a ingresado mal el captcha, ingresar nuevamente");
                            }
                            document.getElementById("idcaptcha").value= "";
                            random.innerHTML = " ";
                        }

                    }
                }
            }
            catch (error) {
                all.innerHTML = "<h1>Error - Conection Failed!</h1>";
            }
       }

      
    });

    


