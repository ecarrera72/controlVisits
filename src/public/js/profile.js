$(document).ready(function(){
    $('#checkPassUpd').on('change', '', function(){
        let val = false
        $(this).is(':checked') ? val = true : $('.passwd').val('');
        $('.passwd').prop('required', val);
    });
});