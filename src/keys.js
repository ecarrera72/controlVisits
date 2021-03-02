const db = require('./sqlite');

let sql = `SELECT host, user, password, database, port 
            FROM occupyDatabaseSetting as ods 
            JOIN databaseConnectionSettings as dcs ON dcs.id = ods.id`;
let a;
db.all(sql, []).then( (row) => {
    a = row[0];
});

console.log(a);

module.exports = {
    database: {
        host: '192.168.1.150',
        user: 'root',
        password: 'aztektec321',
        database: 'VISIT',
        port: 3306
    }
}