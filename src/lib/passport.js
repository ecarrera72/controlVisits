const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const encript = crypto.createHash('md5').update(password).digest('hex');
    const rows = await pool.query('SELECT * FROM user WHERE user_ = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        //const validPassword = await helpers.matchPassword(password, user.password);
        if (encript == user.password) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.name_user));
        } else {
            done(null, false, req.flash('message', 'Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El Nombre de Usuario NO existe'));
    }
}));

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };

    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO user SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.oid);
});

passport.deserializeUser( async (id, done) => {
    const row = await pool.query('SELECT * FROM user WHERE oid = ?', [id]);
    done(null, row[0]);
});