const { isloggedIn } = require('../../lib/auth');
const { apiRest, getAuth } = require('../../service/api');
const express = require('express');
const router = express.Router();

router.get( "/",  isloggedIn, async ( req, res ) => {
    try {
        categories = await apiRest( 'get', 'category', null, null, req.app.locals.token )
        articles = await apiRest( 'get', 'article', null, null, req.app.locals.token );
        res.render('shop/shopping', { articles: articles.data, categories: categories.data });
    } catch (error) {
        console.error(error.stau);
        switch (error.status) {
            case 404:
                response = { data: null }    
                break;
            case 401:
                token = await getAuth();
                req.app.locals.token = token.data;
                res.redirect('..');
                break;
            default:
                break;
        }
    }
});

module.exports = router;