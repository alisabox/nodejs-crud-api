import { agent } from 'supertest';
import { server } from '..';
import { IN_MEMORY_BASE } from './utils';

const request = agent(server);
const mockUsers = [
  {
    id: "85047b82-2ac5-475d-8272-bed500f39caf",
    username: "Cersei",
    age: 31,
    hobbies: ["killing", "ruling"],
  },
  {
    id: "519275c4-0ecf-426c-b9c8-525b0966fecd",
    username: "Sansa",
    age: 17,
    hobbies: ["princes", "dresses"],
  },
];

const newMockUser = {
  username: "Tyrion",
  age: 27,
  hobbies: ["rum", "women"],
};

describe('GET/', () => {
  afterEach(() => {
    IN_MEMORY_BASE.splice(0, IN_MEMORY_BASE.length);
    server.close();
  })

  it('should return all users', async () => {
    IN_MEMORY_BASE.push(...mockUsers);
    const res = await request.get('/api/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUsers);
  })

  it('should return user by id', async () => {
    IN_MEMORY_BASE.push(...mockUsers);
    const res = await request.get('/api/users/85047b82-2ac5-475d-8272-bed500f39caf');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUsers[0]);
  })

  it('should not return user if userId does not exist', async () => {
    IN_MEMORY_BASE.push(...mockUsers);
    const res = await request.get('/api/users/85047b82-2ac5-475d-8272-bed500f39cad');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({});
  })
})

describe('POST/', () => {
  afterEach(() => {
    IN_MEMORY_BASE.splice(0, IN_MEMORY_BASE.length);
    server.close();
  })

  it('should add a new user', async () => {
    IN_MEMORY_BASE.push(...mockUsers);
    const res = await request.post('/api/users').send(newMockUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual(newMockUser.username);
    expect(IN_MEMORY_BASE.length).toEqual(3);
  })
})

describe('PUT/', () => {
  afterEach(() => {
    IN_MEMORY_BASE.splice(0, IN_MEMORY_BASE.length);
    server.close();
  })

  it('should change user data', async () => {
    IN_MEMORY_BASE.push(...mockUsers);
    const res = await request.put('/api/users/85047b82-2ac5-475d-8272-bed500f39caf')
      .send({
        username: "Cersei Lannister",
        age: 31,
        hobbies: ["ruling"],
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual("Cersei Lannister");
    expect(res.body.hobbies.length).toEqual(1);
    expect(IN_MEMORY_BASE[1].username).toEqual("Cersei Lannister");
    expect(IN_MEMORY_BASE[1].hobbies.length).toEqual(1);
  })
})

describe('DELETE/', () => {
  afterEach(() => {
    IN_MEMORY_BASE.splice(0, IN_MEMORY_BASE.length);
    server.close();
  })

  it('should delete user data', async () => {
    IN_MEMORY_BASE.push(...mockUsers);
    const res = await request.delete('/api/users/85047b82-2ac5-475d-8272-bed500f39caf');

    expect(res.statusCode).toEqual(204);
    expect(IN_MEMORY_BASE.length).toEqual(1);
    expect(IN_MEMORY_BASE[0].username).toEqual("Sansa");
  })
})