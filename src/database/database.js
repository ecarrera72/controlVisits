const mysql = require('mysql');
const { promisify } = require('util');
const { dbSettings } = require('./sqlite');

let pool = null;

async function connectiondb() {
    if (pool == null) { 
        pool = mysql.createPool(await dbSettings());
        pool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('DATABASE CONNECTION WAS CLOSED');
                }
                else if (err.code === 'ERR_CON_COUNT_ERROR') {
                    console.error('DATABASE HAS TO MANY CONNECTION');
                }
                else if (err.code === 'ECONNREFUSED') {
                    console.error('DATABASE CONNECTION WAS REFUSED');
                }
                else {
                    console.error(err.code, err.sqlMessage);
                }

            }
            if (connection) { 
                connection.release();
                console.log("Mysql is Connected");
            }
            return;
        });

        pool.query = promisify(pool.query);
    }

    return pool;
}

module.exports = {
    connectiondb
};