const exphbs = require('express-handlebars');
//const favicon = require('express-favicon');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { getAuth } = require('./service/api');

const app = express();

async function main() {
    require('./lib/passport');
    const token = await getAuth();

    // Settings
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('./lib/handlebars')
    }));
    app.set('view engine', '.hbs');

    app.use(session({ 
        secret: 'secureAztek',
        resave: false,
        saveUninitialized: false
    }));
    app.use(flash());
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(passport.initialize());
    app.use(passport.session());
    //app.use(favicon(path.join( __dirname, 'public', 'img', 'shopIco.png' )));
   
    // Global variables
    app.use((req, res, next) => {
        app.locals.success = req.flash('success');
        app.locals.message = req.flash('message');
        app.locals.user = req.user;
        app.locals.token = token.data;
        app.locals.cartAmount = { count: 0 };
        next();
    });

    // Routes
    app.use(require('./routes/index'));
    app.use(require('./routes/authentication'));
    app.use('/catalogs/area', require('./routes/catalogs/area'));
    app.use('/catalogs/document', require('./routes/catalogs/document'));
    app.use('/catalogs/user', require('./routes/catalogs/user'));
    app.use('/catalogs/employee', require('./routes/catalogs/employee'));
    app.use('/reports/visits', require('./routes/reports/visits'));
    app.use('/shop/shoppingCart', require('./routes/shop/shoppingCart'));
    app.use('/shop/shopping', require('./routes/shop/shopping'));

    // Public
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, '../node_modules')));

    // Starting the server
    app.listen( app.get('port'), () => {
        console.log("Server on port", app.get('port'));
    } );
}

main();