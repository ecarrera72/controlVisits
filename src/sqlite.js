const sqlite = require('sqlite3').verbose()
const { join} = require('path');

const db = new sqlite.Database(join(__dirname, 'dbSqlite', 'configuration.db'), (err) => {
    if (err) console.error(err);
    console.log('Sqlite is Connected.');
});

const queries = {
    settingsdb: `SELECT host, user, password, database, port
                FROM occupyDatabaseSetting as ods 
                JOIN databaseConnectionSettings as dcs ON dcs.id = ods.idDatabaseSettings`,
    
    settingsemail: `SELECT mail, password, host, port FROM mailSettings`
}

async function dbSettings() {
    return new Promise((resolve, reject) => {
        db.get(queries.settingsdb, [], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

async function emailSettings() {
    return new Promise((resolve, reject) => {
        db.get(queries.settingsemail, [], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

module.exports = {
    dbSettings,
    emailSettings
};

// exports.close=function() {
//     return new Promise(function(resolve, reject) {
//         this.db.close()
//         resolve(true)
//     }) 
// }