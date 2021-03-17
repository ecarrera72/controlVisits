const axios = require('axios');
const { apiSettings } = require('../sqlite');

let settings = null;

async function getSetting() {
    if (settings == null){ settings = await apiSettings(); }
    return settings;
}

async function getData(entity) {
    const resSettings = await getSetting();
    return await axios.get(`${resSettings.host}:${resSettings.port}/${resSettings.path}/${entity}`);
}

async function postData(entity, objetc) {
    const resSettings = await getSetting();
    return await axios.post(`${resSettings.host}:${resSettings.port}/${resSettings.path}/${entity}`, objetc);
}

module.exports = {
    getData,
    postData
}