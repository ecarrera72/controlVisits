$(document).ready(function(){
    $('#mytable').on('click','.edit',function(){
        $('#EditModal').modal('show');
        $('.areaDescription').val($(this).data('description'));
        $('.areaId').val($(this).data('id'));
    });

    $('#bntAdd').on('click', '', function(){
        $('#ModalAdd').modal('show');
    });

});