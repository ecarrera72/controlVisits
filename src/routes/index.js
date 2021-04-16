const { isloggedIn, isNotLoggedIn } = require('../lib/auth');
const { apiRest } = require('../service/api');
const express = require('express');
const { response } = require('express');
const router = express.Router();

router.get('/', isNotLoggedIn, (req, res) => {
    res.redirect('/signin');
});

router.get('/index', isloggedIn, async (req, res) => {
    //res.redirect('/shop/shopping')
    res.render('index');
});


module.exports = router;