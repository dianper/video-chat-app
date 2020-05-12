let CustomAxios;
if (process.env.NODE_ENV !== 'development') {
  CustomAxios = require('./axios.prod').default;
} else {
  CustomAxios = require('./axios.dev').default;
}

export { CustomAxios };
export { default as SocketConfigs } from './socket.config';
export { default as IceServersConfigs } from './iceServers.config';
