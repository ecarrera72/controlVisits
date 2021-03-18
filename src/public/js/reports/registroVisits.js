$(document).ready(function () {

    let confiDatepicker = {
        //formatter: (input, date, instance) => { input.value = strftime('%d-%m-%Y', date)},
        formatter: (input, date, instance) => { input.value = strftime('%d-%m-%Y', date)},
        customMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        customDays: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        dateSelected: new Date()
    }

    datepicker('#toDatePicker', confiDatepicker);
    datepicker('#fromDatePicker', confiDatepicker);

    $('#btnFilter').on('click', function () {
        $('#tbl').bootstrapTable('refresh');
    });

    $('#btnClear').on('click', function () {
        $('#fromDatePicker').val('');
        $('#toDatePicker').val('');
        $('#tbl').bootstrapTable('refresh');
    });    
    
    $('#tbl').on('dbl-click-row.bs.table', function(row, $element, field) {
        document.getElementById('name').innerHTML = $element.pcNombreCompleto;
        document.getElementById('gender').innerHTML = $element.peGender == 'M' ? 'Masculino' : 'Femenino';
        document.getElementById('visit').innerHTML = $element.vrVisitSubject;
        document.getElementById('document').innerHTML = $element.dtDescription;
        document.getElementById('area').innerHTML = $element.arDescription;
        document.getElementById('employee').innerHTML = $element.is_employee == '1' ? 'Si' : 'No';
        document.getElementById('visitant').innerHTML = $element.typeVisit;
        document.getElementById('entryDate').innerHTML = $element.vrVisitCheckDate;
        document.getElementById('departureDate').innerHTML = $element.vrVisitExitDate;

        $.get('/reports/visits/imgDocuments', { oidPerson: $element.pcPersonOid }).done( (data) => {
            $('#imgPhoto').empty().append(`
                <img src="data:image/jpeg;base64,`+ data.photo +`" class="shadow rounded-circle img-fluid img-thumbnail">
            `);

            $('#imgFront').empty().append(`
                <img src="data:image/jpeg;base64,`+ data.document_front +`" class="shadow rounded img-fluid img-thumbnail imgDocs">
            `);

            $('#imgBack').empty().append(`
                <img src="data:image/jpeg;base64,`+ data.document_back +`" class="shadow rounded img-fluid img-thumbnail imgDocs">
            `);
        });

        $('#modalVisits').modal('show');
    })
});

function queryParams(params) {
    params.visitCheckDateIni = $('#fromDatePicker').val();
    params.visitCheckDateFin = $('#toDatePicker').val();
    return params
}