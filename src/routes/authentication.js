const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');

const pool = require('../database');
const { isloggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

// router.post('/signin', passport.authenticate('local.signin', {
//     successRedirect: '/profile',
//     failureRedirect: '/signup',
//     failureFlash: true
// }));

router.post('/signin', isNotLoggedIn, async (req, res, next) => {
    console.log(req.body);
    req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');

    const rows = await pool.query('SELECT * FROM user WHERE user_ = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        if (req.body.password === user.password) {
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The username does not exists'));
    }


    // passport.authenticate('local.signin', {
    //     successRedirect: '/profile',
    //     failureRedirect: '/signin',
    //     failureFlash: true
    // })(req, res, next);
});

router.get('/profile', isloggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout', isloggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;