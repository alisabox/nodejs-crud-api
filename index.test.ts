import { agent } from 'supertest';
import { server } from '.';
import { IN_MEMORY_BASE, ReceivedUser } from './src/utils';

const request = agent(server);

const newMockUser: ReceivedUser = {
  username: "Tyrion",
  age: 27,
  hobbies: ["rum", "women"],
};

describe('CRUD API', () => {
  let newUserId = '';

  afterAll(() => {
    server.close();
  })

  it('GET/ should return an empty array', async () => {
    const res = await request.get('/api/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  })

  it('POST/ should add a new user', async () => {
    const res = await request.post('/api/users').send(newMockUser);
    newUserId = res.body.id;

    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual(newMockUser.username);
    expect(IN_MEMORY_BASE.length).toEqual(1);
  })

  it('GET/ should return user by id', async () => {
    const res = await request.get('/api/users/' + newUserId);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(IN_MEMORY_BASE[0]);
    expect(res.body.username).toEqual(newMockUser.username);
  })

  it('PUT/ should change user data', async () => {
    const res = await request.put('/api/users/' + newUserId)
      .send({
        username: "Cersei Lannister",
        age: 31,
        hobbies: ["ruling"],
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual("Cersei Lannister");
    expect(res.body.hobbies.length).toEqual(1);
    expect(IN_MEMORY_BASE[0].username).toEqual("Cersei Lannister");
    expect(IN_MEMORY_BASE[0].hobbies.length).toEqual(1);
  })

  it('DELETE/ should delete user data', async () => {
    const res = await request.delete('/api/users/' + newUserId);

    expect(res.statusCode).toEqual(204);
    expect(IN_MEMORY_BASE.length).toEqual(0);
  })

  it('GET/ by inexistent id should return empty object', async () => {
    const res = await request.get('/api/users/' + newUserId);

    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('User Not Found');
    expect(res.body).toEqual({});
  })
})