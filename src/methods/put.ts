import { IncomingMessage, ServerResponse } from 'http';
import { getUser, getUserJSON, isUUID, updateUser } from '../utils';

export const putUserMethod = async(req: IncomingMessage, res: ServerResponse, id?: string): Promise<void> => {
  if (id && isUUID(id)) {
    let body = '';
    req.on('data', async (chunk) => {
      body += chunk.toString();
      const userExists = await getUser(id);
      if (userExists) {
        const updatedUser = await updateUser(body, id);
        if (updatedUser) {
          res.writeHead(200, { 'Content-type': 'application/json' });
          res.end(await getUserJSON(id));
        } else {
          res.writeHead(400, { 'Content-type': 'application/json' });
          res.end('Invalid Data Format');
        }
      } else {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end('User Not Found');
      }
    });
  } else {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end('Invalid UserId');
  }
}