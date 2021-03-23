const express = require('express');
const router = express.Router();
const { isloggedIn } = require('../../lib/auth');
const { getData, postData, getDataParams } = require('../../service/api');

router.get('/', isloggedIn, async (req, res) => {
    const response = await getDataParams('person/type-person', '1');

    response.data.response.forEach(row => {
        row.gender = row.gender == 'F' ? 'Mujer' : 'Hombre';
        
        if (row.active == 1) { 
            row.active = 'Activo';
            row.status = true;
        } else {
            row.active = 'Inactivo';
            row.status = false;
        }
    });

    res.render('catalogs/employee', { rows: response.data.response });
});

router.post('/save', isloggedIn, async (req, res) => {
    const insert = req.body;
    insert.isEmployee = 1;
    insert.visitantTypeOid = 0;
    insert.active = 1;

    try {
        await postData('person/create/', insert)
        req.flash('success', 'Empleado agregado correctamente.');
    } catch (error) {
        console.error(error);
        if (error.response.data.code == -1) { 
            req.flash('message', 'Erro: el empleado ya existe.');
        } else {
            req.flash('message', 'Erro al intertar agregar empleado.');
        }
    }

    res.redirect('/catalogs/employee');   
});

router.post('/update', isloggedIn, async (req, res) => {
    const update = req.body;
    try {
        await postData('person/create/', update)
        req.flash('success', 'Empleado actualizado correctamente.');
    } catch (error) {
        console.error(error);
        if (error.response.data.code == -1) {
            req.flash('message', 'Erro: el empleado ya existe.');
        } else {
            req.flash('success', 'Erro al intertar actualizar empleado.');
        }
    }

    res.redirect('/catalogs/employee');
});

module.exports = router;