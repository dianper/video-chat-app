if (process.env.NODE_ENV !== 'development') {
    module.exports = require('./requests.prod');
} else {
    module.exports = require('./requests.dev');
}
