const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('../views/links/add.hbs');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('INSERT INTO links SET ?', [newLink]);
    req.flash('success', 'Link saved successfully.');
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    console.log(links);
    res.render('../views/links/list.hbs', {links});
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render("../views/links/edit.hbs", {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
    res.redirect('/links');
});

module.exports = router;