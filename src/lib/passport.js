const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
//const { connectiondb } = require('../database');
//const helpers = require('../lib/helpers');
const { getDataParams } = require('../service/api');

passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const encript = crypto.createHash('md5').update(password).digest('hex');
    const response = await getDataParams('user/auth', `${username}/${encript}`);

    if (response.data.response !== null) {
        const user = response.data.response;
        done(null, user, req.flash('success', 'Bienvenido ' + user.nameUser));
    } else {
        done(null, false, req.flash('message', 'Usuario y/o Contaseña Incorrecto.'));
    }
}));

// passport.use('local.signup', new localStrategy({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback: true
// }, async (req, username, password, done) => {
//     const { fullname } = req.body;
//     const newUser = {
//         username,
//         password,
//         fullname
//     };

//     newUser.password = await helpers.encryptPassword(password);
//     const result = await pool.query('INSERT INTO user SET ?', [newUser]);
//     newUser.id = result.insertId;
//     return done(null, newUser);
// }));

passport.serializeUser((user, done) => {
    done(null, user.oid);
});

passport.deserializeUser( async (id, done) => {
    const response = await getDataParams('user', `${id}`);    
    done(null, response.data.response);
});