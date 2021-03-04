window.onload = function() {

var tabNames = ["Inicio", "Noticias", "Acerca de"];
var tabValues = ["<p>Esta es la página de inicio de la web de nuestra empresa</p>", "<img border='0' src='https://www.w3.org/html/logo/downloads/HTML5_Logo_64.png' alt='HTML5 logo' />", "<p>Este ejemplo ha sido realizado por los profesores de Aplicaciones Multimedia</p>"];

// Crear elemento span asociado al tabs[i]
// Añadir el texto al span el valor de tabNanes[i]


// Acceder a los elementos SPAN
var nav = document.getElementById("main");
tabs = nav.getElementsByTagName("span");

//Acceder a las secciones
sections = document.getElementsByTagName("section");

// Asignar un escuchador del evento 'click'
for(var i=0; i<tabs.length ; i++) {
  tabs[i].addEventListener("click",activarPestaña);


}

//console.log("contador = "+contador);

}

function activarPestaña() {

  contador = 0;
 console.log("contador = "+contador++);
  for (var i=0;i<tabs.length;i++){
  //Resaltará la nueva pestaña activa y desactivará el resto.
    //Ocultará las secciones del documento excepto la seleccionada.
   var tabClasses = tabs[i].classList;
   var sectionClasses = sections[i].classList;

   if( tabs[i] == this ) {
     tabClasses.add("currenttab");
     sectionClasses.add("current");
   }else {
     tabClasses.remove("currenttab");
     sectionClasses.remove("current");
   }



  }
}
