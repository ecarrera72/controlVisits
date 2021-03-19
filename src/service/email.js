const { createTransport } = require('nodemailer');
const { join } = require('path');
const { emailSettings } = require('../sqlite');
const hbs = require('nodemailer-express-handlebars');

let transport = null;
let settings = null;
let optionsHbs = null;

async function mail(message) {
    if (transport == null) {
        settings = await emailSettings();

        transport = createTransport({
            host: settings.host,
            port: settings.port,
            secure: false,
            auth: {
                user: settings.mail,
                pass: settings.password
            }
        });

        if (await transport.verify()) {
            optionsHbs = {
                viewEngine: {
                    partialsDir: join(__dirname, '../templates/partials'),
                    layoutsDir: join(__dirname, '../templates/layout'),
                    extname: '.hbs'
                },
                extName: '.hbs',
                viewPath: 'src/templates'
            };

            transport.use('compile', hbs( optionsHbs ));
        }
    }

    message.from = `Aztek Control y Automatizacion <${settings.mail}>`

    let info = await transport.sendMail( message );

}

module.exports = {
    mail
}