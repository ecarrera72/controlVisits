const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const { generate } = require('generate-password');
const { connectiondb } = require('../database');
const { isloggedIn, isNotLoggedIn } = require('../lib/auth');
const { mail } = require('../service/email');
const { getData, postData } = require('../service/api');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/index',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/index',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isloggedIn, (req, res) => {
    res.render('profile');
});

router.post('/profile', isloggedIn, async (req, res) => {
    if (req.body.password !== '') {
        req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
    } else {
        req.body.password = req.body.passUser;
    }

    try {
        await postData('user/create/', req.body)
        req.flash('success', 'Usuario actualizado correctamente.');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        if (error.response.data.code == -1) {
            req.flash('message', 'Erro: el usuario ya existe.');
        } else {
            req.flash('success', 'Erro al intertar actualizar al usurio.');
        }

        res.redirect('/profile');
    }
});

router.get('/logout', isloggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

router.get('/forgot', isNotLoggedIn, (req, res) => {
    res.render('auth/forgot');
});

router.post('/forgot', isNotLoggedIn, async (req, res) => {
    const rows = await (await connectiondb()).query('SELECT * FROM user WHERE user_ = ?', [req.body.username]);
    if (rows.length > 0) {
        const password = generate({ length: 10, numbers: true });
        const update = await (await connectiondb()).query('UPDATE user SET password = MD5(?) WHERE oid = ?', [password, rows[0].oid]);

        if (update.affectedRows == 1 ) {
            await mail({ to: rows[0].user_email, subject: 'Recuperar Contraseña', template: 'forgot', context: { password }});   
        }
        
        req.flash('success', 'Se envio contraseña al correo registrado');
        res.redirect('/signin');
    } else {
        req.flash('message', 'El Usuario NO existe');
        res.redirect('/forgot');
    }
});

module.exports = router;