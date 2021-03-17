const express = require('express');
const router = express.Router();
//const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
const { getData, postData } = require('../../service/api');

router.get('/', isloggedIn, async (req, res) => {
    const response = await getData('area/');

    response.data.response.forEach(row => {
        if (row.active == 1) { 
            row.active = 'Activo';
            row.status = true;
        } else {
            row.active = 'Inactivo';
            row.status = false;
        }
    });

    res.render('catalogs/area', { rows: response.data.response });
});

router.post('/save', isloggedIn, async (req, res) => {
    const insert = { 
        description: req.body.description, 
        active: 1 
    }

    try {
        await postData('area/create/', insert)
        req.flash('success', 'Area agregada correctamente.');
    } catch (error) {
        if (error.response.data.code == -1) { 
            req.flash('message', 'Error: el area ya existe.');
        } else {
            console.error(error);
            req.flash('message', 'Error al intertar agregar el area.');
        }
    }

    res.redirect('/catalogs/area');
});

router.post('/update', isloggedIn, async (req, res) => {
    const update = {
        oid: req.body.id,
        description: req.body.description,
        active: req.body.active
    }

    try {
        await postData('area/create/', update)
        req.flash('success', 'Area actualizada correctamente.');
    } catch (error) {
        if (error.response.data.code == -1) { 
            req.flash('message', 'Error: el area ya existe.');
        } else {
            console.error(error);
            req.flash('message', 'Error al intertar actualizar el area.');
        }
    }

    res.redirect('/catalogs/area');
});

module.exports = router;