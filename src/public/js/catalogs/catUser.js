$(document).ready(function(){
    
    $('#mytable').on('click','.edit',function(){
        let status = $(this).data('active') ? 1 : 0;
        $('#EditModal').modal('show');
        $('.userId').val( $(this).data('id') );
        $('.userName').val( $(this).data('name') );
        $('.user').val( $(this).data('user') );
        $('.userActive').val( status );
        $('.typeUser').val( $(this).data('typeiduser') );
    });

    $('#bntAdd').on('click', '', () => { $('#formAdd').trigger('reset'); });

    $('#mytable').on('change', '.check', function(){
        let status = $(this).is(':checked') ? 'Activo' : 'Inactivo';
        let index  = $(this).closest('tr').index();
        let tr = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[index];
        tr.getElementsByTagName('label')[0].innerHTML = status;

        let data = {
            id: $(this).data('id'),
            name_user: $(this).data('name'),
            user_: $(this).data('user'),
            password: '',
            active: status == 'Activo' ? 1 : 0,
            user_type_oid: $(this).data('typeiduser')
        }

        $.post( '/catalogs/user/update', data);
    });

    $('#checkPassUpd').on('change', '', function(){
        let val = false
        $(this).is(':checked') ? val = true : $('.passwd').val('');
        $('.passwd').prop('required', val);
    });
});