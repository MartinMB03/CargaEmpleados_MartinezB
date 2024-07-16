// Variable global para almacenar las personas
let personas = [];

// Funcion para calcular los años de aporte restantes
const calcularAnosAporteRestantes = (edad, sexo) => {
    const anosJubilacion = (sexo === 'masculino') ? 65 : 60;
    return anosJubilacion - edad;
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

//Funcion para mostrar los detalles de una persona
const mostrarDetallesPersona = async (persona) => {
    const detallesPersonas = document.getElementById('detallesPersonas');

    const divPersona = document.createElement('div');
    divPersona.classList.add('persona');
    divPersona.dataset.dni = persona.dni;

    try {
        // Hacer una solicitud AJAX para obtener información adicional
        const response = await fetch(`https://api.example.com/info/${persona.dni}`); //ejemplo para aplicar ajax
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        divPersona.innerHTML = `
            <p><strong>Nombre:</strong> ${persona.nombre} ${persona.apellido}</p>
            <p><strong>DNI:</strong> ${persona.dni}</p>
            <p><strong>Sexo:</strong> ${persona.sexo}</p>
            <p><strong>Edad:</strong> ${persona.edad}</p>
            <p><strong>Teléfono:</strong> ${persona.telefono}</p>
            <p><strong>Nacionalidad:</strong> ${persona.nacionalidad}</p>
            <p><strong>Años de aporte restantes:</strong> ${persona.anosAporteRestantes}</p>
            <p><strong>Información Adicional:</strong> ${data.informacion_adicional}</p>
            <button class="eliminar" onclick="eliminarPersona(event)">Eliminar</button>
        `;
    } catch (error) {
        console.error('Hubo un problema al cargar información adicional:', error);
        // Mostrar un mensaje de error al usuario si falla la solicitud
        divPersona.innerHTML = `
            <p><strong>Nombre:</strong> ${persona.nombre} ${persona.apellido}</p>
            <p><strong>DNI:</strong> ${persona.dni}</p>
            <p><strong>Sexo:</strong> ${persona.sexo}</p>
            <p><strong>Edad:</strong> ${persona.edad}</p>
            <p><strong>Teléfono:</strong> ${persona.telefono}</p>
            <p><strong>Nacionalidad:</strong> ${persona.nacionalidad}</p>
            <p><strong>Años de aporte restantes:</strong> ${persona.anosAporteRestantes}</p>
            <p><strong>Información Adicional:</strong> No disponible en este momento</p>
            <button class="eliminar" onclick="eliminarPersona(event)">Eliminar</button>
        `;
    }

    detallesPersonas.appendChild(divPersona);

    // Mostrar la alerta de SweetAlert2
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Persona agregada correctamente",
        showConfirmButton: false,
        timer: 1900
    });

    // Agregar persona al array global
    personas.push(persona);

    // Actualizar datos en localStorage después de agregar una persona
    localStorage.setItem('personas', JSON.stringify(personas));
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

// Funcion para cargar personas desde un archivo JSON local
const cargarDatosDesdeJSONLocal = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        personas = await response.json();
        console.log('Datos cargados desde JSON:', personas); // Verificar los datos cargados
        // Mostrar las personas obtenidas del JSON
        personas.forEach(persona => mostrarDetallesPersona(persona));

        // Guardar en localStorage
        localStorage.setItem('personas', JSON.stringify(personas));
    } catch (error) {
        console.error('Hubo un problema con la operación de fetch:', error);
    }
}

// Funcion principal
const main = () => {
    // Cargar datos desde localStorage si existen
    if (localStorage.getItem('personas')) {
        personas = JSON.parse(localStorage.getItem('personas'));
        personas.forEach(persona => mostrarDetallesPersona(persona));
    } else {
        cargarDatosDesdeJSONLocal(); // Cargar desde JSON local si no hay datos en localStorage
    }

    const formulario = document.getElementById('formularioEmpleado');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const persona = crearPersona();
        mostrarDetallesPersona(persona);
        limpiarFormulario();
    });
};

// Funcion para eliminar una persona de la lista
const eliminarPersona = (event) => {
    const divPersona = event.target.parentNode;

    // Obtener el dni de la persona a eliminar desde el dataset
    const dniPersonaEliminar = divPersona.dataset.dni;

    // Eliminar visualmente
    divPersona.remove();

    // Filtrar la persona a eliminar por dni en el array global personas
    personas = personas.filter(persona => persona.dni !== dniPersonaEliminar);

    // Actualizar datos en localStorage después de eliminar una persona
    localStorage.setItem('personas', JSON.stringify(personas));
};

// Llamar a la funcion principal para comenzar la aplicación
main();
