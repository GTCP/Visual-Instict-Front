document.addEventListener("DOMContentLoaded", function(){
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

})