const { isloggedIn } = require('../../lib/auth');
const express = require('express');
const router = express.Router();

router.get( "/",  isloggedIn, async ( req, res ) => {
    res.render('shop/shoppingCart');
});

module.exports = router;