const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const { dbSettings } = require('./sqlite');

// Initializations
const app = express();

async function main() {
    require('./lib/passport');

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

    // Middlewares
    app.use(session({ 
        secret: 'aztekmysql',
        resave: false,
        saveUninitialized: false,
        store: new MySQLStore(await dbSettings())
    }));
    app.use(flash());
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(passport.initialize());
    app.use(passport.session());

    // Global variables
    app.use((req, res, next) => {
        app.locals.success = req.flash('success');
        app.locals.message = req.flash('message');
        app.locals.user = req.user;
        next();
    });

    // Routes
    app.use(require('./routes/index'));
    app.use(require('./routes/authentication'));
    app.use('/catalogs/area', require('./routes/catalogs/area'));
    app.use('/catalogs/document', require('./routes/catalogs/document'));
    app.use('/catalogs/user', require('./routes/catalogs/user'));
    app.use('/reports/visits', require('./routes/reports/visits'));

    // Public
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, '../node_modules')));

    // Starting the server
    app.listen( app.get('port'), () => {
        console.log("Server on port", app.get('port'));
    } );
}

main();