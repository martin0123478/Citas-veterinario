const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');

const contenedorCitas = document.querySelector('#citas');

let editando;
class Citas{
    constructor(){
        this.citas = []
    }
    agregarCita(cita){
        this.citas = [...this.citas,cita]
        
    }
    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
    }
    editarCita(citaActualoizada){
        this.citas = this.citas.map(cita=> cita.id === citaActualoizada.id? citaActualoizada: cita )

    }
}

class UI{
    imprimirAlerta(mensaje,tipo){
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12')

        if(tipo==='error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('success-danger')
        }

        //mensaje
        divMensaje.textContent = mensaje
        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));

        //quitar alerta
        setTimeout(() => {
            divMensaje.remove()
        }, 5000);
    }
    imprimirCitas({citas}){
        this.limpiarHTML()
        citas.forEach(cita=>{
            const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita
            const divCita = document.createElement('div');
            divCita.classList.add('cita','p-3')
            divCita.dataset.id = id
            //scripting de datos de cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p')
            propietarioParrafo.innerHTML=`
            <span class="font-weight-bolder">Propietario:</span> ${propietario}
            
            `

            const telefonoParrafo = document.createElement('p')
            telefonoParrafo.innerHTML=`
            <span class="font-weight-bolder">Telefono:</span> ${telefono}
            
            `
            const fechaParrafo = document.createElement('p')
            fechaParrafo.innerHTML=`
            <span class="font-weight-bolder">Fecha:</span> ${fecha}
            
            `
            const horaParrafo = document.createElement('p')
            horaParrafo.innerHTML=`
            <span class="font-weight-bolder">Hora:</span> ${hora}
            
            `
            const sintomasParrafo = document.createElement('p')
            sintomasParrafo.innerHTML=`
            <span class="font-weight-bolder">Sintomas:</span> ${sintomas}
            
            `
            //Boton para eliminar Cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr2')
            btnEliminar.innerHTML = 'Eliminar   '

            btnEliminar.onclick= () => elminarCita(id)

            //Añade boton de editar
            const btnEditar =   document.createElement('button')
            btnEditar.classList.add('btn','btn-info')
            btnEditar.innerHTML = 'Editar'
            btnEditar.onclick = () => cargarEdicion(cita)
            //Agregar parrafos a divcita
            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(propietarioParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(horaParrafo)
            divCita.appendChild(sintomasParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)
            //agregar citas html
            contenedorCitas.appendChild(divCita)
        })
    }
    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI()
const administratCitas = new Citas()


eventListeners()
function eventListeners(){
    mascotaInput.addEventListener('change',datosCita)
    propietarioInput.addEventListener('change',datosCita)
    telefonoInput.addEventListener('change',datosCita)
    fechaInput.addEventListener('change',datosCita)
    horaInput.addEventListener('change',datosCita)
    sintomasInput.addEventListener('change',datosCita)

    formulario.addEventListener('submit',nuevaCita)
}



const citaObj = {
    mascota:'',
    propietario:'',
    telefono:'',
    fecha:'',
    hora:'',
    sintomas:''
}

function datosCita(e){
    citaObj[e.target.name] = e.target.value
    
}

function nuevaCita(e){
    e.preventDefault()
    //extrater informacion de objeto de cita
    const {mascota,propietario,telefono,fecha,hora,sintomas} = citaObj
    //Validar
    if(mascota ==='' || propietario === '' || telefono === '' || fecha === '' || hora=== '' || sintomas===''){
        ui.imprimirAlerta('Todos los campos son obligatorios','error')
        return;
    }
    if(editando ){
        ui.imprimirAlerta('Editado correctamente')
        //pasar objeto de edicion
        administratCitas.editarCita({...citaObj})
        formulario.querySelector('button[type="submit"]').textContent= 'Crear cita';
        //quitar modo edicion
        editando = false
        //Pasar el objeto de la cita a edicion
    }else{
        //generar id
        citaObj.id = Date.now()
        //crear cita
        administratCitas.agregarCita({...citaObj})
        //mensaje de agregado correstamente
        ui.imprimirAlerta('Se agrego correctamente')
    }
    
    //reiniciar objeto
    reiniciarObjeto()
    //reiniciar formulario
    formulario.reset()

    //Mostrat citas en HTML
    ui.imprimirCitas(administratCitas)
}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function elminarCita(id){
    //Eliminar cita

    administratCitas.eliminarCita(id)
   
    //Muestre mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente')
    //Refrescar las citas
    ui.imprimirCitas(administratCitas)
}
//cargar datos y edicion
function cargarEdicion(cita){
    const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita

    //lenar inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    //Lenar el objeto
    citaObj.mascota = mascota
    citaObj.propietario = propietario
    citaObj.telefono =telefono
    citaObj.fecha = fecha
    citaObj.hora = hora
    citaObj.sintomas = sintomas
    citaObj.id = id


    //cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent= 'Guardar cambios';
    editando = true;

}