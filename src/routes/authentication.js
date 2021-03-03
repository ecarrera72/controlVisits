const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generate } = require('generate-password');
const { connectiondb } = require('../database');
const { isloggedIn, isNotLoggedIn } = require('../lib/auth');

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

router.get('/logout', isloggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

router.get('/forgot', isNotLoggedIn, (req, res) => {
    res.render('auth/forgot');
});

router.post('/forgot', isNotLoggedIn, async (req, res) => {
    console.log(req.body);
    const rows = await (await connectiondb()).query('SELECT * FROM user WHERE user_ = ?', [req.body.username]);
    if (rows.length > 0) {
        const password = generate({ length: 10, numbers: true });
        req.flash('success', 'Se envio contraseña al correo ' + req.body.email);
        res.redirect('/signin');
    }
    req.flash('message', 'El Usuario NO existe');
    res.redirect('/forgot');
});

module.exports = router;