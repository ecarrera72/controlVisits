$(document).ready(function(){
    
    $('#mytable').on('click','.edit',function(){
        let status = $(this).data('active') ? 1 : 0;
        $('#EditModal').modal('show');
        $('.areaDescription').val( $(this).data('description') );
        $('.areaId').val( $(this).data('id') );
        $('.areaActive').val( status );
    });

    $('#bntAdd').on('click', '', () => { $('#formAdd').trigger('reset'); });

    $('#mytable').on('change', '.check', function(){
        let status = $(this).is(':checked') ? 'Activo' : 'Inactivo';
        let index  = $(this).closest('tr').index();
        let tr = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[index];
        tr.getElementsByTagName('label')[0].innerHTML = status;

        let data = {
            id: $(this).data('id'),
            description: $(this).data('description'),
            active: status == 'Activo' ? 1 : 0
        }

        $.post( '/catalogs/document/update', data);
    });

});