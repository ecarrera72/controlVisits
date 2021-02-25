const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isloggedIn } = require('../lib/auth');

router.get('/add', isloggedIn, (req, res) => {
    res.render('links/add.hbs');
});

router.post('/add', isloggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        userId: req.user.id
    };
    await pool.query('INSERT INTO links SET ?', [newLink]);
    req.flash('success', 'Link saved successfully.');
    res.redirect('/links');
});

router.get('/', isloggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE userId = ?', [req.user.id]);
    console.log(links);
    res.render('links/list.hbs', {links});
});

router.get('/delete/:id', isloggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Link removed successfully.');
    res.redirect('/links');
});

router.get('/edit/:id', isloggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render("links/edit.hbs", {link: links[0]});
});

router.post('/edit/:id', isloggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link updated successfully.');
    res.redirect('/links');
});

module.exports = router;