import http from 'http';
import { createUser, deleteUser, getUser, getUserJSON, isUUID, Method, updateUser, usersBase } from './src/utils';

const PORT = process.env.PORT || 5000;

const server = http.createServer(async(req, res) => {
  const baseUrl = '/api/users';
  const id = req.url?.replace(baseUrl, '').substring(1);
  let body = '';
  res.writeHead(200, { 'Content-type': 'application/json' });
  
  if (req.url?.startsWith(baseUrl)) {
    if (!id) {
      switch (req.method) {
        case Method.GET:
          res.end(JSON.stringify(usersBase));
          break;
        case Method.POST:
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
          break;
        default:
          res.end(JSON.stringify(usersBase));
          break;
      }
    } else {
      switch (req.method) {
        case Method.GET:
          if (isUUID(id)) {
            const userExists = await getUser(id);
            if (userExists) {
              res.end(await getUserJSON(id));
            } else {
              res.writeHead(404, { 'Content-type': 'application/json' });
              res.end('User Not Found');
            }
          } else {
            res.writeHead(400, { 'Content-type': 'application/json' });
            res.end('Invalid UserId');
          }
          break;
        case Method.PUT:
          if (isUUID(id)) {
            req.on('data', async (chunk) => {
              body += chunk.toString();
              const userExists = await getUser(id);
              if (userExists) {
                const updatedUser = await updateUser(body, id);
                if (updatedUser) {
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
          break;
        case Method.DELETE:
          if (isUUID(id)) {
            req.on('data', async (chunk) => {
              body += chunk.toString();
              const deletedUser = await deleteUser(id);
              if (deletedUser) {
                res.writeHead(204, { 'Content-type': 'application/json' });
                res.end();
              } else {
                res.writeHead(404, { 'Content-type': 'application/json' });
                res.end('User Not Found');
              }
            });
          } else {
            res.writeHead(400, { 'Content-type': 'application/json' });
            res.end('Invalid UserId');
          }
          break;
      }
    }
  } else {
    res.writeHead(404, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route Not Found' }));
  }
});

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
