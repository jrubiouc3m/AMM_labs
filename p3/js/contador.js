contador=0;

function incContador() {
      contador++;
      if (contador == 1) {
      var msg = "Has pulsado " + contador + " vez"
      } else {
      var msg = "Has pulsado " + contador + " veces"
      }
        mostrar(msg);
}

 function mostrar(msg) {
   alert(msg);
 }
