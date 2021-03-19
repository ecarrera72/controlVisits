const express = require('express');
const router = express.Router();
//const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
//const strftime = require('strftime');
const { getData, getDataParams, getDataObject } = require('../../service/api');

router.get('/', isloggedIn, async (req, res) => {
    res.render('reports/visits');
});

router.get('/info', isloggedIn, async (req, res) => {
    delete req.query.search
    try {
        let response = null;

        if ( req.query.visitCheckDateIni !== '' &&  req.query.visitCheckDateFin !== '' ) {
            response = await getDataObject( 'visit/visit-by-date', req.query );
        } else {
            response = await getData( 'visit/' );
        }
        const rows = response.data.response;
        /* rows.forEach(row => {
            row.visit_check_date = strftime('%d-%m-%Y %H:%M:%S', row.visit_check_date);
            if (row.visit_exit_date !== null) row.visit_exit_date = strftime('%d-%m-%Y %H:%M:%S', row.visit_exit_date);
        }); */

        res.json(rows);

    } catch (error) {
        console.log(error);
    }
});

router.get('/imgDocuments', isloggedIn, async (req, res) => {
    const response = await getDataParams( 'person/person-doc', req.query.oidPerson );    
    const row = response.data.response[0];
    /* row.documentFront = Buffer.from(row.documentFront).toString('base64');
    row.documentBack = Buffer.from(row.documentBack).toString('base64');
    row.photo = Buffer.from(row.photo).toString('base64'); */

    res.json(row);
});

module.exports = router;