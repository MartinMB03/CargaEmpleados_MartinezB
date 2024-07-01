
// Funcion para calcular los años de aporte restantes
const calcularAnosAporteRestantes = (edad, sexo) => {
    const añosJubilacion = (sexo === 'masculino') ? 65 : 55;
    return añosJubilacion - edad;
};

// Funcion para crear un objeto de persona
const crearPersona = () => {
    const persona = {};

    // Solicitar informacion y asignar al objeto de persona
    persona.nombre = document.getElementById('nombre').value;
    persona.apellido = document.getElementById('apellido').value;
    persona.dni = document.getElementById('dni').value;
    persona.sexo = document.getElementById('sexo').value;
    persona.edad = parseInt(document.getElementById('edad').value);
    persona.telefono = document.getElementById('telefono').value;
    persona.nacionalidad = document.getElementById('nacionalidad').value;

    // Calcular y asignar los años de aporte restantes
    persona.anosAporteRestantes = calcularAnosAporteRestantes(persona.edad, persona.sexo);

    return persona;
};

// Funcion para mostrar los detalles de una persona
const mostrarDetallesPersona = (persona) => {
    const detallesPersonas = document.getElementById('detallesPersonas');

    const divPersona = document.createElement('div');
    divPersona.classList.add('persona');
    divPersona.dataset.dni = persona.dni;   // Uso dataset para almacenar el dni como atributo
    divPersona.innerHTML = `
        <p><strong>Nombre:</strong> ${persona.nombre} ${persona.apellido}</p>
        <p><strong>DNI:</strong> ${persona.dni}</p>
        <p><strong>Sexo:</strong> ${persona.sexo}</p>
        <p><strong>Edad:</strong> ${persona.edad}</p>
        <p><strong>Teléfono:</strong> ${persona.telefono}</p>
        <p><strong>Nacionalidad:</strong> ${persona.nacionalidad}</p>
        <p><strong>Años de aporte restantes:</strong> ${persona.anosAporteRestantes}</p>
        <button class="eliminar" onclick="eliminarPersona(event)">Eliminar</button>
    `;
    detallesPersonas.appendChild(divPersona);

    // Guardar persona en localStorage
    guardarPersonaEnLocalStorage(persona);
};

// Funcion para guardar una persona en local Storage y uso de .JSON
const guardarPersonaEnLocalStorage = (persona) => {
    let personasGuardadas = JSON.parse(localStorage.getItem('personas')) || [];
    personasGuardadas.push(persona);
    localStorage.setItem('personas', JSON.stringify(personasGuardadas));
};

// Funcion para cargar personas almacenadas en local Storage al iniciar la aplicación
const cargarPersonasDesdeLocalStorage = () => {
    const personasGuardadas = JSON.parse(localStorage.getItem('personas')) || [];
    personasGuardadas.forEach(persona => mostrarDetallesPersona(persona));
};

// Funcion para limpiar los campos del formulario
const limpiarFormulario = () => {
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('nacionalidad').value = '';
};

// Funcion principal
const main = () => {
    cargarPersonasDesdeLocalStorage();

    const formulario = document.getElementById('formularioEmpleado');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const persona = crearPersona();
        mostrarDetallesPersona(persona);
        limpiarFormulario();
    });
};

// Funcion para eliminar una persona de la lista y del local Storage
const eliminarPersona = (event) => {
    const divPersona = event.target.parentNode;

    // Obtener el dni de la persona a eliminar desde el dataset
    const dniPersonaEliminar = divPersona.dataset.dni;

    // Eliminar visualmente
    divPersona.remove();

    // Obtener personas almacenadas en localStorage
    let personasGuardadas = JSON.parse(localStorage.getItem('personas')) || [];

    // Filtrar la persona a eliminar por dni y guardar la lista actualizada en local Storage
    personasGuardadas = personasGuardadas.filter(persona => persona.dni !== dniPersonaEliminar);
    localStorage.setItem('personas', JSON.stringify(personasGuardadas));
};

// Llamar a la funcion principal para comenzar el simulador
main();
