let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: [

    ]
}



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

    ///muestra el resumen de la cita
    mostrarResumen()

    ////almacena el nombre del cliente
    nombreCita()


    ///almacena la fecha de la cita
    fechaCita()

    //almacena la hora
    horaCita()

    /// funcion para deshabilitar dias anteriores
    deshabilitarFecha()
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

}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion()

            botonesPaginacion()

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

        const id = parseInt( elemento.dataset.idServicio );

        eliminarServicio(id)
    } else {
        elemento.classList.add('active');


        const servicioObj = {
            id: parseInt( elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
    

        agregarServicion(servicioObj)
    }

}

/// funcioes para agregar servicios a la compra

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
}

function agregarServicion(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
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
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); /// estamos en la pagina de resumen y deberia cargar la cita
    } else {
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }

    mostrarSeccion()
}

//validacion de informacion 

function mostrarResumen() {
    // destructutacion 
    const { nombre, fecha, hora, servicios} = cita;

    /// selecciona el resumen
    const resumentDiv = document.querySelector('.contenido-resumen');

    /// lipia el html
    while(resumentDiv.firstChild) {
        resumentDiv.removeChild(resumentDiv.firstChild);
    }


    ////validacion 

    if(Object.values(cita).includes('')) {

        const mensajeForm = document.createElement('P')
        mensajeForm.textContent = 'Falta seleccionar el servicio o completar los datos.';
        mensajeForm.classList.add('invalidar-cita');

        //aca mostramos el mensaje
        resumentDiv.appendChild(mensajeForm);

        return
    }

    let cantidad = 0;

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    ///mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicos';
    servicioCita.appendChild(headingServicios);




    //////////////////////////////////////////////////////////////////
    servicios.forEach(servicio => {
        const { nombre, precio } = servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad += parseInt(totalServicio[1].trim());
    


        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        
        servicioCita.appendChild(contenedorServicio);
        
    });
    /////////////////////////////////////////////////////////////////////
    
    resumentDiv.appendChild(headingCita);
    resumentDiv.appendChild(nombreCita);
    resumentDiv.appendChild(fechaCita);
    resumentDiv.appendChild(horaCita);

    resumentDiv.appendChild(servicioCita);


    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total')
    cantidadPagar.innerHTML = `<span>Total a pagar:</span> $${cantidad}`;

    resumentDiv.appendChild(cantidadPagar);
}


//// funcion del almacenamiento de la cita 
function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', (e) => {
        const nombreTexto = e.target.value.trim();

        ///validacion de nombreTexto
        if( nombreTexto === '' || nombreTexto.length < 3) {
          
        mostrarAlerta('Nombre no valido', 'error')

        } else {
            const alerta = document.querySelector('.alerta');
            cita.nombre = nombreTexto;

            if(alerta) {
                alerta.remove()
            }
        }

    })
}


//// alerta de error 

function mostrarAlerta(mensaje, tipo) {

    ///esto sirve para no imprimir la alerta varias veces
    const alertaPrevia = document.querySelector('.alerta');
    if ( alertaPrevia ) {
        return
    }

    ////////////////////////////////////////////////////////////
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error')
    }


    ///instertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    ///ELiminar la alerta despues de 3 segundo
    setTimeout(() => {
        alerta.remove()
    }, 3000)
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');

    fechaInput.addEventListener('input', (e) => {
        const dia = new Date(e.target.value).getUTCDay();

        if([0].includes(dia)) {

            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('El domingo no trabajamos, por favor seleccione otro dia.', 'error');

        } else {
            cita.fecha = fechaInput.value;
        }

    })
}

function deshabilitarFecha() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();

    const year = fechaAhora.getUTCFullYear();
    const mes = fechaAhora.getMonth() +1;
    const dia = fechaAhora.getDate() +1;
    
    //// aca se hizo esta metodo ya que para poder bloquear la fecha en html debomos contar con 2 digitos tanto en dia como en mes sino de lo contrario no va a funcionar

    const fechaDeshabilitar = `${year}-${mes < 10 ?  `0${mes}`: mes }-${dia < 10 ? `0${dia}`:dia}`;

    // inputFecha.setAttribute("value", fechaDeshabilitar);
    // inputFecha.setAttribute("min", fechaDeshabilitar);

    inputFecha.min = fechaDeshabilitar;




}

function horaCita() {
    const horaInput = document.querySelector('#hora');

    horaInput.addEventListener('input', (e) => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 20) {
            
           mostrarAlerta('Horario no disponible', 'error');
           setTimeout(() => {
               horaInput.value = '';
           }, 2000)
            
        } else {
            cita.hora = horaCita;
        }
    })

}