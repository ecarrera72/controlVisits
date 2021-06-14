const { apiRest, getAuth } = require('../../service/api');
const { isloggedIn } = require('../../lib/auth');
const express = require('express');
const router = express.Router();

router.get( "/",  isloggedIn, async ( req, res ) => {
    try {
        cart = await apiRest( 'get', "cart", null, { idUser: req.app.locals.user.cusu_id }, req.app.locals.token );
        if (cart.status === 200) {
            let total = 0;
            cart.data.forEach( e => { total += e.total_price; });
            res.render( 'shop/shoppingCart', { cart: cart.data, cartTotal: total } );
        }
    } catch (error) {
        switch (error.response.status) {
            case 404:
                response = { data: null }
                break;
            case 401:
                token = await getAuth();
                req.app.locals.token = token.data;
                res.redirect('/');
                break;
            default:
                break;
        }
    }
});

router.post( "/",  isloggedIn, async ( req, res ) => {
    try {
        req.body.user_id = req.app.locals.user.cusu_id
        cart = await apiRest( 'post', "cart", req.body, null, req.app.locals.token );
        if (cart.status === 200) { console.log("Element agregado a la cesta"); }
    } catch (error) {
        switch (error.response.status) {
            case 404:
                response = { data: null }
                break;
            case 401:
                token = await getAuth();
                req.app.locals.token = token.data;
                res.redirect('/');
                break;
            case 500:
                cart = await apiRest( 'put', "cart", req.body, null, req.app.locals.token );
                break;
            default:
                break;
        }
    }
});

module.exports = router;