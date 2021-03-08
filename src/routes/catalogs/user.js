const express = require('express');
const router = express.Router();
const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');

router.get('/', isloggedIn, async (req, res) => {
    const rows = await (await connectiondb()).query(`SELECT u.oid, name_user, user_, u.active, user_type_oid, description
                                                    FROM user as u JOIN user_type as ut ON user_type_oid = ut.oid`);
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
    res.render('catalogs/user', { rows });
});

router.post('/save', isloggedIn, async (req, res) => {
    const insert = { description: req.body.description, active: 1 }
    const rows = await (await connectiondb()).query('INSERT INTO document_type SET ?', [insert]);

    if (rows.affectedRows > 0) req.flash('success', 'Tipo de documento agregado correctamente.');
    else req.flash('success', 'Erro al intertar agregar el tipo de documento.');

    res.redirect('/catalogs/document')
});

router.post('/update', isloggedIn, async (req, res) => {
    const insert = { 
        description: req.body.description,
        active: req.body.active
    }
    const rows = await (await connectiondb()).query('UPDATE document_type SET ? WHERE oid = ?', [insert, req.body.id]);

    if (rows.affectedRows > 0) req.flash('success', 'Tipo documento actualizado correctamente.');
    else req.flash('success', 'Erro al intertar actualizar el tipo de documento.');

    res.redirect('/catalogs/document')
});

module.exports = router;