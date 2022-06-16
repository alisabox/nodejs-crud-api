import { ServerResponse } from 'http';
import { getUser, getUserJSON, isUUID, IN_MEMORY_BASE } from '../utils';

export const getUserMethod = async(res: ServerResponse, id?: string): Promise<void> => {
  if (!id) {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(IN_MEMORY_BASE));
  } else {
    if (isUUID(id)) {
      const userExists = await getUser(id);
      if (userExists) {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(await getUserJSON(id));
      } else {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end('User Not Found');
      }
    } else {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end('Invalid UserId');
    }
  }
}