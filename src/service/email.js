const { createTransport } = require('nodemailer');
const { readFile } = require('fs');
const { join } = require('path');
const { emailSettings } = require('../sqlite');

let transport = null;
let settings = null;

async function mail() {
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
    }

    let verifyConnection = transport.verify((err, success) => {
        if (err) {
            console.error(err);
            return false
        } else {
            return success;
        }
    });

    readFile(join(__dirname, '../templates/layout/layout.hbs'), async (err, data) => {
        if (err) { console.error(err); }
        console.log(data);
        let message = {
            from: 'Aztek Control y Automatizacion <{$settings.mail}>',
            to: 'ecarrera@aztektec.com.mx',
            subject: 'pruebas',
            text: 'Correo Aztek',
            html: data
        }

        let info = await transport.sendMail( message );
        console.log(info);
    });

    // let message = {
    //     from: 'Aztek Control y Automatizacion <{$settings.mail}>',
    //     to: 'ecarrera@aztektec.com.mx',
    //     subject: 'pruebas',
    //     text: 'Correo Aztek',
    //     html: '<p>hola</p>'
    // }

    let info = await transport.sendMail( message );
    console.log(info);
}

module.exports = {
    mail
}