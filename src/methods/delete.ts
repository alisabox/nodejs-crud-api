import { IncomingMessage, ServerResponse } from 'http';
import { deleteUser, isUUID } from '../utils';

export const deleteUserMethod = async(req: IncomingMessage, res: ServerResponse, id?: string): Promise<void> => {
  if (id && isUUID(id)) {
    const deletedUser = await deleteUser(id);
    if (deletedUser) {
      res.writeHead(204, { 'Content-type': 'application/json' });
      res.end();
    } else {
      res.writeHead(404, { 'Content-type': 'text/html' });
      res.end('User Not Found');
    };
  } else {
    res.writeHead(400, { 'Content-type': 'text/html' });
    res.end('Invalid UserId');
  }
}