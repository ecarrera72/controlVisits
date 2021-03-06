const express = require('express');
const router = express.Router();

const { isloggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isNotLoggedIn, (req, res) => {
    res.redirect('/signin');
    //res.render('index');
    //res.render('auth/signin');
});

router.get('/index', isloggedIn, (req, res) => {
    res.render('index');
    //res.render('auth/signin');
});


module.exports = router;