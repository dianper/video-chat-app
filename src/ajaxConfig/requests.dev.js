import axios from 'axios';

const Api = axios.create({ baseURL: 'http://localhost:5080/api/' });

export default Api;