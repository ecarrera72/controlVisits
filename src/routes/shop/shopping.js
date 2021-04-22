const { apiRest, getAuth } = require('../../service/api');
const { isloggedIn } = require('../../lib/auth');
const express = require('express');
const router = express.Router();

router.get( "/:idCategory/",  isloggedIn, async ( req, res ) => {
    try {
        categories = await apiRest( 'get', 'category', null, null, req.app.locals.token );
        articles = await apiRest( 'get', 'article', { page: 0, size: 15 }, { idCategory: req.params.idCategory },
                                req.app.locals.token );
        // console.log(articles.data.total);
        // console.log(articles.data.page);
        // console.log(articles.data.size);
        // console.log( parseInt(articles.data.total / articles.data.size) + 1 );
        res.render('shop/shopping', { articles: articles.data.items, categories: categories.data });
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.statusText);
        console.error(error.response.data);
        switch (error.response.status) {
            case 404:
                response = { data: null }
                break;
            case 401:
                console.log('Token anterior');
                console.log(req.app.locals.token);
                token = await getAuth();
                console.log('Token nuevo');
                console.log(token.data);
                req.app.locals.token = token.data;
                console.log('Token veremos si cambio');
                console.log(req.app.locals.token);
                //res.redirect('/');
                break;
            default:
                break;
        }
    }
});

module.exports = router;