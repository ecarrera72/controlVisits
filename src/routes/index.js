const { isloggedIn, isNotLoggedIn } = require('../lib/auth');
const { apiRest } = require('../service/api');
const express = require('express');
const { response } = require('express');
const router = express.Router();

router.get('/', isNotLoggedIn, (req, res) => {
    res.redirect('/signin');
});

router.get('/index', isloggedIn, async (req, res) => {
    try {
        response = await apiRest( 'get', 'article', null, null, req.app.locals.token);

        console.log(response.data);

        // response.data.forEach( e => {
        //     e.articuloIMG = Buffer.from(e.articuloIMG).toString('base64');
        //     e.articuloPDF = Buffer.from(e.articuloPDF).toString('base64');
        // });

        // console.log(response.data);

    } catch (error) {
        console.error(error.response);
        switch (error.response.status) {
            case 404:
                response = { data: null }    
                break;
            default:
                break;
        }
    }

    res.render('index');
});


module.exports = router;