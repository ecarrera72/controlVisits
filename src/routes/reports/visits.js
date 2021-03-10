const express = require('express');
const router = express.Router();
const { connectiondb } = require('../../database');
const { isloggedIn } = require('../../lib/auth');
const strftime = require('strftime');

router.get('/', isloggedIn, async (req, res) => {
    const rows = await (await connectiondb()).query(`SELECT visit_check_date, visit_exit_date, visit_subject, p.name_, 
                                                    p.father_surname, p.mother_surname, p.is_employee, p.gender, 
                                                    a.description as area, u.user_, vt.description, pd.document_value, 
                                                    dt.description as typeDoc
                                                    FROM visit_registry as vr
                                                    JOIN person as p ON p.oid = vr.employee_person_oid
                                                    JOIN area as a ON a.oid = vr.area_oid
                                                    JOIN user as u ON u.oid = vr.user_oid
                                                    JOIN visitant_type as vt ON vt.oid = p.visitant_type_oid
                                                    JOIN person_document as pd ON pd.person_oid = p.oid
                                                    JOIN document_type as dt ON dt.oid = pd.document_type_oid`);

    rows[0].visit_check_date = strftime('%d-%m-%Y %H:%M:%S' ,rows[0].visit_check_date);


    res.render('reports/visits', { rows });
});

module.exports = router;