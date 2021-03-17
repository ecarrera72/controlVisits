const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
const { getData, postData } = require('../../service/api');

router.get('/', isloggedIn, async (req, res) => {
    const response = await getData('user/');

    response.data.response.forEach(row => {
        console.log(row);
        if (row.active == 1) { 
            row.active = 'Activo';
            row.status = true;
        } else {
            row.active = 'Inactivo';
            row.status = false;
        }
    });

    //res.render('catalogs/area', { rows: response.data.response });

    const rows = await (await connectiondb()).query(`SELECT u.oid, name_user, user_, u.active, user_type_oid, user_email, 
                                                    description FROM user as u JOIN user_type as ut ON user_type_oid = ut.oid`);
    
    const selected = await (await connectiondb()).query(`SELECT * FROM user_type WHERE active = 1`);
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
    res.render('catalogs/user', { rows, selected });
});

router.post('/save', isloggedIn, async (req, res) => {
    const encript = crypto.createHash('md5').update(req.body.password).digest('hex');
    const insert = { 
        name_user: req.body.name_user,
        user_: req.body.user_,
        password: encript,
        active: 1,
        user_type_oid: req.body.user_type_oid,
        user_email: req.body.user_email
    }

    try {
        const rows = await (await connectiondb()).query('INSERT INTO user SET ?', [insert]);
        if (rows.affectedRows > 0) req.flash('success', 'Usuario agregado correctamente.');
    } catch (error) {
        if (error.errno == 1062) {
            req.flash('message', 'Erro: el usuario ya existe.');
        }else {
            console.error(error);
            req.flash('message', 'Erro al intertar agregar el usuario.');
        }
    }    

    res.redirect('/catalogs/user')
});

router.post('/update', isloggedIn, async (req, res) => {
    const update = { 
        name_user: req.body.name_user,
        user_: req.body.user_,
        active: req.body.active,
        user_type_oid: req.body.user_type_oid,
        user_email: req.body.user_email
    }

    if (req.body.password !== '') {
        update.password = crypto.createHash('md5').update(req.body.password).digest('hex');
    }

    const rows = await (await connectiondb()).query('UPDATE user SET ? WHERE oid = ?', [update, req.body.id]);

    if (rows.affectedRows > 0) req.flash('success', 'Usuario actualizado correctamente.');
    else req.flash('success', 'Erro al intertar actualizar al usurio.');

    res.redirect('/catalogs/user')
});

module.exports = router;