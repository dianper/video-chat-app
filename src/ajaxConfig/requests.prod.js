import axios from 'axios';

const Api = axios.create({
    baseURL: 'https://moska-chat.herokuapp.com/api/',
    timeout: 1000
});

export default Api;
