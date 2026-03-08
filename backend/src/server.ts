import app from './app';
import config from './config';
import http from 'http';
import { setupInterviewWebSocket } from './api/interviews/interviews.websocket';

const server = http.createServer(app);
setupInterviewWebSocket(server);

const PORT = config.port;
server.listen(PORT, () => {
    console.log(`Server (HTTP + WebSocket) is running on ${PORT}`);
});


