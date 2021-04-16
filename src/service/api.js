const axios = require('axios');
const { apiSettings } = require('../database/sqlite');

let settings = null;

async function getSetting() {
    if (settings == null){ settings = await apiSettings(); }
    return settings;
}

async function apiRest(metod, entity, data = null, params = null, token = null) {
    await getSetting();

    let config = {
        method: metod,
        url: `${settings.host}:${settings.port}/${entity}`
    };

    if ( data ) {
        config.data = data;
    }

    if ( params ) {
        config.params = params;
    }
    
    if ( token ) {
        config.headers = { 
            'Content-Type': 'application/json',
            'Authorization': `${token.tokenType} ${token.accessToken}`
        }
    }

    return await axios( config );

};

async function getAuth() {
    try {
        return await apiRest( 'post', 'authToken', { cusu_user: 'tuga', cusu_pass: 'secretToken' } );
    } catch (error) {
        console.error(error);
    }    
};

// async function getData(entity) {
//     const resSettings = await getSetting();
//     return await axios.get(`${resSettings.host}:${resSettings.port}/${resSettings.path}/${entity}`);
// }

// async function getDataParams(entity, params) {
//     const resSettings = await getSetting();
//     return await axios.get(`${resSettings.host}:${resSettings.port}/${resSettings.path}/${entity}/${params}`);
// }

// async function getDataObject(entity, object) {
//     const resSettings = await getSetting();
//     return await axios.get(`${resSettings.host}:${resSettings.port}/${resSettings.path}/${entity}`, { data: object });
// }

// async function postData(entity, objetc) {
//     await getSetting();
//     return await axios.post(`${settings.host}:${settings.port}/${entity}`, objetc);
// }

module.exports = {
    apiRest,
    getAuth
}

// module.exports = {
//     getData,
//     getDataParams,
//     getDataObject,
//     postData
// }