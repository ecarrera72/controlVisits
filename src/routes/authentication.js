const { apiRest } = require('../service/api');
const { isloggedIn, isNotLoggedIn } = require('../lib/auth');
const { generate } = require('generate-password');
const { mail } = require('../service/email');
const passport = require('passport');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

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
        await apiRest('user/create/', req.body)
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
    const response = await apiRest('user/user-name/', req.body.username);
    const rows = response.data.response;

    if (rows.length > 0) {
        const password = generate({ length: 10, numbers: true });
        
        rows[0].password = crypto.createHash('md5').update(password).digest('hex');;
        delete  rows[0].creationTimestamp;

        const update = await apiRest('user/create/', rows[0]);

        if ( update.data.code == 0 ) {
            await mail(
                { 
                    to: rows[0].userEmail,
                    subject: 'Recuperacion de Contraseña',
                    template: 'forgot',
                    context: { password }
                }
            );
        }
        
        req.flash('success', 'Se envio contraseña al correo registrado');
        res.redirect('/signin');
    } else {
        req.flash('message', 'El Usuario NO existe');
        res.redirect('/forgot');
    }
});

module.exports = router;