if (process.env.NODE_ENV !== 'development') {
    module.exports.axios = require('./requests.prod');
    module.exports.socketURL = 'https://moska-chat.herokuapp.com';
} else {
    module.exports.axios = require('./requests.dev');
    module.exports.socketURL = 'http://127.0.0.1:5080';
}
