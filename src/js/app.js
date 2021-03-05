let pagina = 1;


document.addEventListener('DOMContentLoaded',() => {
    iniciarApp()
});

function iniciarApp() {
    mostrarServicios()

    //se resallta la seccion activa
    mostrarSeccion()


    //se seleciona la seccion a la que se quiere se quiere cambiar
    cambiarSeccion()

    //paginacion
    paginaSiguiente()

    paginaAnterior()

    //// comprueba la pagina donde se encuantra pára ver que boton mostrar y cual no
    botonesPaginacion()
}

function mostrarSeccion() {

     ///elimina mostrar-seccion se la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }


    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    

    /// elimnar el color resaltado
    const tabAnterior = document.querySelector('.tabs .active');
    if ( tabAnterior ) {
        tabAnterior.classList.remove('active');
    }

    //resalta el tab donde se esta parado 
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('active');

    
     //resalta la seccion seleccionada
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('active')

}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // /// se agrega mostrar seccion
        const seccion = document.querySelector(`#paso-${pagina}`);
        seccion.classList.add('mostrar-seccion');

        //resalta la seccion seleccionada
        const tab = document.querySelector(`[data-paso="${pagina}"]`);
        tab.classList.add('active')

        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const {servicios} = db;

        //ACA SE GENERA EL HTML
        
        servicios.forEach( servicio => {
            const {id, nombre, precio} = servicio;

            // DOM SCRIPTING

            //div
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            
            //agregar el active al servicio que se quiere seleccionas 
            servicioDiv.onclick = seleccionarServicio;

            //se agregan los hijos al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //se agrega el div armado al html
            document.querySelector('#servicios').appendChild(servicioDiv)

        });
    } catch (error){
        console.log(error)
    }
}

function seleccionarServicio(e) {
    let elemento;
    
    //ACA FORZAMOS QUE EL ELEMEENTO AL CUAL LE DAMOS CLICK SEA EL DIV

    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('active')) {
        elemento.classList.remove('active');
    } else {
        elemento.classList.add('active');
    }

}



///////funciones de paginacion

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        botonesPaginacion()
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginacion()
    });
}

function botonesPaginacion() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 2) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
    }

    mostrarSeccion()
}