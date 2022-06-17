import http, { IncomingMessage, ServerResponse } from 'http';
import cluster from 'cluster';
import dotenv from 'dotenv';
import { deleteUserMethod } from './src/methods/delete';
import { getUserMethod } from './src/methods/get';
import { postUserMethod } from './src/methods/post';
import { putUserMethod } from './src/methods/put';
import { Method } from './src/utils';
import { env } from 'process';

dotenv.config();

const PORT = process.env.PORT;

export const server = http.createServer(async(req: IncomingMessage, res: ServerResponse) => {
  const baseUrl = '/api/users';
  const id = req.url?.replace(baseUrl, '').substring(1);

  try {
    if (req.url === baseUrl || req.url?.startsWith(baseUrl) && id) {
      switch (req.method) {
        case Method.GET:
          await getUserMethod(res, id);
          break;
        case Method.POST:
          await postUserMethod(req, res);
          break;
        case Method.PUT:
          await putUserMethod(req, res, id);
          break;
        case Method.DELETE:
          await deleteUserMethod(req, res, id);
          break;
        default:
          await getUserMethod(res);
          break;
      }
    } else {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route Not Found' }));
    }
  } catch (err) {
    res.writeHead(500, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

// Load balancer
if (env.npm_config_mode === 'multi') {
  const numCPUs = require('os').cpus().length;

  if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    server.listen(PORT, () => {
      console.log(`Worker ${process.pid} started`);
    });
  }
} else {
  server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
}