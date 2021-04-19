const { isloggedIn } = require('../../lib/auth');
const { apiRest, getAuth } = require('../../service/api');
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
        console.error(error.response);
        switch (error.response.status) {
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