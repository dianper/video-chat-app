import io from 'socket.io-client';
import { socketURL } from '../config';

const MySocket = io(socketURL);

export default MySocket;
