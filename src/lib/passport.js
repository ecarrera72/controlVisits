const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const { apiRest, getAuth } = require('../service/api');

passport.use('local.signin', new localStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, user, password, done) => {
    let response;
    const encript = crypto.createHash('md5').update(password).digest('hex');
    let data = { cusu_user: user, cusu_pass: encript }
    try {
        response = await apiRest( 'get', 'login', data, null, req.app.locals.token);
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
    if (response.data !== null) {
        const user = response.data;
        done(null, user, req.flash('success', 'Bienvenido ' + user.cusu_user));
    } else {
        done(null, false, req.flash('message', 'Usuario y/o Contaseña Incorrecto.'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser( async (user, done) => {
    //const response = await apiRest('get', 'user', null, id, );    
    done(null, user);
});