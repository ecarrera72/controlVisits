const { format } = require('timeago.js');

const helper = {};

helper.timeago = (timestamp) => {
    return format(new Date(timestamp));
};

module.exports = helper;