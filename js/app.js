const $table = document.querySelector('.crud-table');
const $form = document.querySelector('.crud-form');
const $title = document.querySelector('.crud-title');

const $template = document.getElementById('crud-template').content;
const $fragment = document.createDocumentFragment();

/* 
    -> CREAMOS UNA FUNCION CON LA PETICION AJAX XMLHTTPREQUEST
 */

const ajax = (options) => { // recibira un objeto de opciones

    // vamos a destructurar ese parametro OPTIONS
    // ese objeto recibira los siguientes valores
    let { url, method, success, error, data } = options;

    // creamos la instancia de ajax
    const xhr = new XMLHttpRequest();

    // asignamos el evento
    xhr.addEventListener('readystatechange', (e) => {

        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
            let data = JSON.parse(xhr.responseText);

            success(data);
        } else {

            let message = xhr.statusText || 'Data not found';
            error(`Error ${xhr.status}: ${message}`);

        }

    })

    // abrimos la peticion
    // si no enviamos un method por defecto sera GET
    xhr.open(method || 'GET', url);

    // definimos la cabezera
    xhr.setRequestHeader('Content-Type', 'application/json');

    // envimos la peticion (data de la api)
    xhr.send(JSON.stringify(data));

}

const getForwards = () => {

    ajax({
        method: 'GET',
        url: 'http://localhost:3000/delanteros',
        success: (data) => {

            console.log(data);
            data.forEach((el) => {
                $template.querySelector('.nombre').textContent = el.nombre;
                $template.querySelector('.pais').textContent = el.pais;
                $template.querySelector('.edit').dataset.id = el.id;
                $template.querySelector('.edit').dataset.nombre = el.nombre;
                $template.querySelector('.edit').dataset.pais = el.pais;
                $template.querySelector('.delete').dataset.id = el.id;

                let clone = document.importNode($template, true);
                $fragment.appendChild(clone);
            })

            $table.querySelector('tbody').appendChild($fragment);

        },
        error: (error) => {

            let comp = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${error}.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
            </div>
            `;
            console.log(error);
            $table.insertAdjacentHTML('afterend', comp);

        },
        data: null
    })

}

document.addEventListener('DOMContentLoaded', getForwards);

document.addEventListener('submit', (e) => {

    if (e.target === $form) {

        e.preventDefault();

        if (!e.target.id.value) {
            // CREATE
            ajax({
                url: 'http://localhost:3000/delanteros',
                method: 'POST',
                success: (res) => {
                    location.reload();
                },
                error: (error) => {
                    let comp = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">${error}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                    $form.insertAdjacentHTML('afterend', comp);

                },
                data: {
                    nombre: e.target.nombre.value,
                    pais: e.target.pais.value
                }
            })

        } else {
            // UPDATE
            ajax({
                url: `http://localhost:3000/delanteros/${e.target.id.value}`,
                method: 'PUT',
                success: (res) => {
                    location.reload();
                },
                error: (error) => {
                    let comp = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">${error}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                    $form.insertAdjacentHTML('afterend', comp);
                },
                data: {
                    nombre: e.target.nombre.value,
                    pais: e.target.pais.value
                }
            })
        }

    }

})

document.addEventListener('click', (e) => {

    if (e.target.matches('.edit')) {
        // alert('EDITAR');
        $title.textContent = 'Editar Jugador';
        $form.nombre.value = e.target.dataset.nombre;
        $form.pais.value = e.target.dataset.pais;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches('.delete')) {
        // alert('ELIMINAR'); 
        let respuesta = confirm('¿Desea eliminar al jugador de la base de datos?');
        if (respuesta) {
            ajax({
                url: `http://localhost:3000/delanteros/${e.target.dataset.id}`,
                method: 'DELETE',
                success: (res) => {

                    location.reload();

                },
                error: (error) => {
                    let comp = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">${error}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        `;
                    $form.insertAdjacentHTML('afterend', comp);
                }
            })
        }
    }

})