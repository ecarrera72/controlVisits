document.addEventListener( 'DOMContentLoaded' , () => {
    const table = document.getElementById('mytable');

    table.addEventListener( 'click', ( event ) => {
        if (event.target.tagName === 'A') {

            document.getElementById('oid').value = event.target.dataset.id;
            document.getElementById('name').value = event.target.dataset.name;
            document.getElementById('fatherSurname').value = event.target.dataset.father;
            document.getElementById('motherSurname').value = event.target.dataset.mother;
            document.getElementById('gender').value = event.target.dataset.gender == 'Hombre' ? 'M' : 'F';
            document.getElementById('active').value = event.target.dataset.active;

        } else if (event.target.tagName === 'INPUT') {

            let index = event.target.closest('tr').rowIndex;
            let tr = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[index - 1];
            tr.getElementsByTagName('label')[0].innerHTML = event.target.checked ? 'Activo' : 'Inactivo';

            let data = {
                oid: event.target.dataset.id,
                name: event.target.dataset.name,
                fatherSurname: event.target.dataset.father,
                motherSurname: event.target.dataset.mother,
                gender: event.target.dataset.gender == 'Hombre' ? 'M' : 'F',
                isEmployee: 1,
                visitantTypeOid: 0,
                active: event.target.checked ? 1 : 0
            }

            let http = new XMLHttpRequest();
            http.open('POST', '/catalogs/employee/update', true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.send( JSON.stringify(data) );
        }
    });
});