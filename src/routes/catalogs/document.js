const express = require('express');
const router = express.Router();
//const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
const { getData, postData } = require('../../service/api');

router.get('/', isloggedIn, async (req, res) => {
    const response = await getData('doctype/');

    response.data.response.forEach(row => {
        if (row.active == 1) { 
            row.active = 'Activo';
            row.status = true;
        } else {
            row.active = 'Inactivo';
            row.status = false;
        }
    });

    res.render('catalogs/document', { rows: response.data.response });

    // const rows = await (await connectiondb()).query('SELECT * FROM document_type');
});

router.post('/save', isloggedIn, async (req, res) => {
    const insert = { 
        description: req.body.description, 
        active: 1 
    }

    try {
        await postData('doctype/create/', insert)
        req.flash('success', 'Tipo de documento agregado correctamente.');
    } catch (error) {
        if (error.response.data.code == -1) { 
            req.flash('message', 'Error: el tipo de cocumento ya existe.');
        } else {
            console.error(error);
            req.flash('message', 'Error al intertar agregar el tipo de documento.');
        }
    }

    res.redirect('/catalogs/document');
});

router.post('/update', isloggedIn, async (req, res) => {
    const update = {
        oid: req.body.id,
        description: req.body.description,
        active: req.body.active
    }

    try {
        await postData('doctype/create/', update)
        req.flash('success', 'Tipo documento actualizado correctamente.');
    } catch (error) {
        if (error.response.data.code == -1) { 
            req.flash('message', 'Error: el tipo de cocumento ya existe.');
        } else {
            console.error(error);
            req.flash('message', 'Error al intertar actualizar el tipo de documento.');
        }
    }

    res.redirect('/catalogs/document');
});

module.exports = router;