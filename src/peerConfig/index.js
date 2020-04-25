if (process.env.NODE_ENV === 'development')
  module.exports = {
    host: 'localhost',
    port: 5080,
    path: '/peerjs'
  };
else
  module.exports = {
    host: 'moska-chat.herokuapp.com',
    port: 443,
    path: '/peerjs'
  };