const Configs = {
    transports: ['websocket'],
    uri: ''
}

if (process.env.NODE_ENV !== 'development') {
    Configs.uri = 'https://moska-chat.herokuapp.com';
} else {
    Configs.uri = 'http://127.0.0.1:5080';
}

export default Configs;