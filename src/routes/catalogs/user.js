const express = require('express');
const router = express.Router();
const crypto = require('crypto');
//const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
const { getData, postData } = require('../../service/api');

router.get('/', isloggedIn, async (req, res) => {
    const resUser = await getData('user/');
    const resTypeUser = await getData('user/type-user/');

    resUser.data.response.forEach(row => {
        resTypeUser.data.response.forEach( rowType => {
            if ( row.typeUser == rowType.oid ) row.description = rowType.description;
        });

        if (row.active == 1) { 
            row.active = 'Activo';
            row.status = true;
        } else {
            row.active = 'Inactivo';
            row.status = false;
        }
    });

    res.render('catalogs/user', { rows: resUser.data.response, selected: resTypeUser.data.response  });
});

router.post('/save', isloggedIn, async (req, res) => {
    const insert = req.body;
    insert.password = crypto.createHash('md5').update(req.body.password).digest('hex');
    insert.active = 1;

    try {
        await postData('user/create/', insert)
        req.flash('success', 'Usuario agregado correctamente.');
    } catch (error) {
        console.error(error);
        if (error.response.data.code == -1) { 
            req.flash('message', 'Erro: el usuario ya existe.');
        } else {
            req.flash('message', 'Erro al intertar agregar el usuario.');
        }
    }

    res.redirect('/catalogs/user');   
});

router.post('/update', isloggedIn, async (req, res) => {
    const update = req.body;
    if (req.body.changePassword === 'true') {
        update.password = crypto.createHash('md5').update(req.body.password).digest('hex');
    } else if (req.body.passwordUser !== undefined) {
        update.password = req.body.passwordUser
    }

    try {
        await postData('user/create/', update)
        req.flash('success', 'Usuario actualizado correctamente.');
    } catch (error) {
        console.error(error);
        if (error.response.data.code == -1) {
            req.flash('message', 'Erro: el usuario ya existe.');
        } else {
            req.flash('success', 'Erro al intertar actualizar al usurio.');
        }
    }

    res.redirect('/catalogs/user');
});

module.exports = router;