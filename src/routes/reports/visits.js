const express = require('express');
const router = express.Router();
const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
const strftime = require('strftime');

router.get('/', isloggedIn, async (req, res) => {
    res.render('reports/visits');
});

router.get('/info', isloggedIn, async (req, res) => {
    let query = `SELECT CONCAT(p.name_,' ',p.father_surname,' ',p.mother_surname) as nombre, visit_subject, 
        a.description as area, dt.description as typeDoc, visit_check_date, visit_exit_date, p.is_employee, p.gender,
        vt.description as typeVisit, p.oid as oid_person, u.user_
        FROM visit_registry as vr
        JOIN person as p ON p.oid = vr.employee_person_oid
        JOIN area as a ON a.oid = vr.area_oid
        JOIN user as u ON u.oid = vr.user_oid
        JOIN visitant_type as vt ON vt.oid = p.visitant_type_oid
        JOIN person_document as pd ON pd.person_oid = p.oid
        JOIN document_type as dt ON dt.oid = pd.document_type_oid `;

    if (req.query.fromDate !== '') {
        if (req.query.fromDate !== undefined) {
            query = query + `WHERE DATE(visit_check_date) >= '${req.query.fromDate}'`;   
        }
    }

    if (req.query.toDate !== '') {
        if (req.query.toDate !== undefined) {
            let operador = query.includes("WHERE") ? " AND" : "WHERE";
            query = query + operador + ` DATE(visit_check_date) <= '${req.query.toDate}'`;
        }
    }

    query = query + ` ORDER BY visit_check_date DESC`;

    console.log(query);

    const rows = await (await connectiondb()).query(query);

    rows.forEach(row => {
        row.visit_check_date = strftime('%d-%m-%Y %H:%M:%S', row.visit_check_date);
        if (row.visit_exit_date !== null) row.visit_exit_date = strftime('%d-%m-%Y %H:%M:%S', row.visit_exit_date);
    });

    res.json(rows);
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