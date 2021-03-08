const express = require('express');
const router = express.Router();
const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');

router.get('/', isloggedIn, async (req, res) => {
    const rows = await (await connectiondb()).query('SELECT * FROM area');
    rows.forEach( row => { 
        if (row.active == 1) { 
            row.active = 'Activo';
            row.status = true;
        }
        else {
            row.active = 'Inactivo';
            row.status = false;
        }
    })
    res.render('catalogs/area', { rows });
});

router.post('/save', isloggedIn, async (req, res) => {
    const insert = { description: req.body.description, active: 1 }
    const rows = await (await connectiondb()).query('INSERT INTO area SET ?', [insert]);

    if (rows.affectedRows > 0) req.flash('success', 'Area agregada correctamente.');
    else req.flash('success', 'Erro al intertar agregar el area.');

    res.redirect('/catalogs/area')
});

router.post('/update', isloggedIn, async (req, res) => {
    const insert = { 
        description: req.body.description,
        active: req.body.active
    }
    const rows = await (await connectiondb()).query('UPDATE area SET ? WHERE oid = ?', [insert, req.body.id]);

    if (rows.affectedRows > 0) req.flash('success', 'Area actualizada correctamente.');
    else req.flash('success', 'Erro al intertar actualizar area.');

    res.redirect('/catalogs/area')
});

module.exports = router;