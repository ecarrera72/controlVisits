const express = require('express');
const router = express.Router();
const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
const strftime = require('strftime');
const { getData, getDataParams, getDataObject, postData } = require('../../service/api');

router.get('/', isloggedIn, async (req, res) => {
    res.render('reports/visits');
});

router.get('/info', isloggedIn, async (req, res) => {
    delete req.query.search
    try {
        const response = await getDataObject( 'visit/visit-by-date', req.query);
        console.log(response.data.response);
        const rows = response.data.response;
        rows.forEach(row => {
            console.log(row);
            // row.visit_check_date = strftime('%d-%m-%Y %H:%M:%S', row.visit_check_date);
            // if (row.visit_exit_date !== null) row.visit_exit_date = strftime('%d-%m-%Y %H:%M:%S', row.visit_exit_date);
        });

        res.json(rows);

    } catch (error) {
        console.log(error);
    }
});

router.get('/imgDocuments', isloggedIn, async (req, res) => {
    const rows = await (await connectiondb()).query(`SELECT document_front, document_back, photo FROM person_document 
                                                    WHERE person_oid = ?`, [ req.query.oidPerson ]);
    
    const row = rows[0];
    row.document_front = Buffer.from(row.document_front).toString('base64');
    row.document_back = Buffer.from(row.document_back).toString('base64');
    row.photo = Buffer.from(row.photo).toString('base64');

    res.json(row);
});

module.exports = router;