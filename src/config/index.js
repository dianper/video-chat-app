if (process.env.NODE_ENV !== 'development') {
  module.exports.axios = require('./axios.prod');
  module.exports.socketURL = 'https://moska-chat.herokuapp.com';
} else {
  module.exports.axios = require('./axios.dev');
  module.exports.socketURL = 'http://127.0.0.1:5080';
}

module.exports.iceServerConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.services.mozilla.com"
    },
    {
      urls: "stun:stun.l.google.com:19302"
    },
    {
      urls: "stun:sip1.lakedestiny.cordiaip.com"
    },
    {
      urls: "stun:stun1.voiceeclipse.net"
    }
  ]
}
