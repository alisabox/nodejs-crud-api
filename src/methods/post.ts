import { IncomingMessage, ServerResponse } from 'http';
import { createUser } from '../utils';

export const postUserMethod = async(req: IncomingMessage, res: ServerResponse): Promise<void> => {
  let body = '';
  req.on('data', async (chunk) => {
    body += chunk.toString();
    const createdUser = await createUser(body);
    if (createdUser) {
      res.writeHead(201, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(createdUser));
    } else {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end('Invalid Data Format');
    }
  });
}