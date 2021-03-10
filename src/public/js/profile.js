$(document).ready(function(){
    $('#checkPassUpd').on('change', '', function(){
        console.log($(this).is(':checked'));
        let val = false
        $(this).is(':checked') ? val = true : $('.passwd').val('');
        $('.passwd').prop('required', val);
    });
});