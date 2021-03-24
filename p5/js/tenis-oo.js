window.onload = function() {
    
    intervalId = 0;  // inicialmente no está jugando
    
    // referencia al elemento canvas
    canvas = document.getElementById("canvas");
    
    if (canvas && canvas.getContext) {

    // referencia al contexto del canvas
    ctx = canvas.getContext("2d");


	// objetos del juego
	pelota = new Pelota(canvas.width / 2, canvas.height / 2);
	raqueta = new Raqueta(canvas.height / 2);


	// registrar escuchadores
	var boton = document.getElementById("playButton");
	boton.addEventListener("click", playstop);
	
	document.addEventListener("keydown", function(event) {
	    if (event.keyCode == 38) raqueta.estado = raqueta.ESTADO.ARRIBA; // flecha arriba
	    if (event.keyCode == 40) raqueta.estado = raqueta.ESTADO.ABAJO;  // flecha abajo
	    
	});  //moverRaqueta
	document.addEventListener("keyup", function(event) {
	    if (event.keyCode == 38 || event.keyCode == 40) raqueta.estado = raqueta.ESTADO.PARADA;
	}); //pararRaqueta
	
	
	// iniciar juego
	playstop();
	
	
    } else {
        // error
        alert("Su navegador no soporta el elemento canvas");
    }
    
}


Pelota = function(x, y) {

    // Tamaño de la pelota
    this.r = 10;
    
    // Coordenadas de la pelota
    this.x = x; //= 200;
    this.y = y; // = 150;

    // Desplazamiento pelota
    this.dx = 3;
    this.dy = 3;

    
    this.actualizarPosicion = function() {
	this.x = this.x + this.dx;
	this.y = this.y + this.dy;
    }
    
    this.dibujar = function(ctx) {

	ctx.strokeStyle = "gray";
	ctx.fillStyle = "white";
	
	// dibuja un círculo
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
    }

}

Raqueta = function(y) {
    
    // Dimensiones raqueta
    this.h = 75;
    this.w = 10;

    // Coordenadas de la raqueta
    this.x = 0;
    this.y = y - this.h/2;  /* nos pasan las coordenadas del centro 
			       de la raqueta, no de la esquina:
			       hay que corregir */
    
    // Desplazamiento raqueta (un poco más lenta que la pelota)
    this.dy = 2;
    
    // Estado de la raqueta:
    this.ESTADO = {
	'PARADA' : 0,     //	0: parado
	'ARRIBA' : -1,    //	-1: hacia arriba
	'ABAJO' : 1       //	1: hacia abajo
    }
    this.estado = this.ESTADO.PARADA;

    
    
    this.actualizarPosicion = function() {
	this.y = this.y + (this.dy * this.estado);   // movemos la raqueta, si es necesario
    }
    
    this.dibujar = function(ctx) {

	// dibuja un rectángulo
	ctx.strokeStyle = "gray";
	ctx.fillStyle = "black";

	ctx.fillRect(this.x, this.y, this.w, this.h);
    }

}



    


pintar = function() {
    
    var dist = 0;    // para controlar el ángulo de rebote con la raqueta
    
    // borrar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // re-pintar
    raqueta.actualizarPosicion();
    raqueta.dibujar(ctx);

    pelota.dibujar(ctx);
    
    // comprobar rebotes arriba y abajo
    if ( ((pelota.y + pelota.dy) > canvas.height)
	 || ((pelota.y + pelota.dy) < 0 ))
    {
        pelota.dy = - pelota.dy;
    }
    
    // comprobar rebotes laterales
    if ((pelota.x + pelota.dx) > canvas.width) {
        pelota.dx = - pelota.dx;
	
    }
    else if ((pelota.x + pelota.dx) < 0) {
	
	// comprobar rebote con raqueta
	if ( (pelota.y > raqueta.y)
	     && ( pelota.y < raqueta.y + raqueta.h) )
	{
	    pelota.dx = - pelota.dx;
	    
	    // cambiar ángulo según nos alejamos del centro de la raqueta
	    // centro de la raqueta: raqueta.y + raqueta.h/2
	    var dist= pelota.y - (raqueta.y + raqueta.h/2); // distancia al centro de la raqueta
	    pelota.dy = pelota.dy + dist/10;

	    puntos++;
	    log("Puntos: " + puntos);
	    
	} else {
	    // Game over
	    //clearInterval(intervalId);
	    playstop();
	}
	
    }
    
    // mover pelota
    pelota.actualizarPosicion();
    
}

    
//Parada y reinicio del juego
playstop = function() {
    
    if(intervalId){

	log("terminar juego");
	// Terminar juego
	clearInterval(intervalId);
	intervalId = 0;
	log("Fin del juego: "+puntos+" puntos");
	    
    } else {
	
	// Iniciar juego
	log("iniciar juego");

	//pelota.x = canvas.width / 2;
	//pelota.y = canvas.height / 2;
	pelota = new Pelota(canvas.width / 2,
					canvas.height / 2);

	//raqueta.y = canvas.height / 2;
	raqueta = new Raqueta(canvas.height / 2);

	
	puntos = 0;
    intervalId = setInterval(pintar, 10);
	
    }
}


//Muestra información al jugador
log = function( text ) {
    var log = document.getElementById("log");
    log.innerHTML = text;
}
