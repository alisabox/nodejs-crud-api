import { v4 as uuid } from 'uuid';

export interface UsersBase {
  id: string,
  username: string,
  age: number,
  hobbies: string[]
}

export interface ReceivedUser {
  username: string,
  age: number,
  hobbies: string[]
}
  
export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const isUUID = (uuid: string): boolean => {
  return !!uuid.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
}

export let usersBase: UsersBase[] = [];

export const createUser = async (body: string): Promise<UsersBase | undefined> => {
  const parsedBody: ReceivedUser = await JSON.parse(body);
  const validUser = parsedBody.username && parsedBody.age && parsedBody.hobbies;

  if (validUser) {
    const newUser: UsersBase = {
      id: uuid(),
      username: parsedBody.username,
      age: parsedBody.age,
      hobbies: parsedBody.hobbies,
    }
    usersBase.push(newUser);
    
    return newUser;
  }
}

export const updateUser = async (body: string, id: string): Promise<boolean> => {
  const parsedBody: ReceivedUser = await JSON.parse(body);
  const validUser = await validateUser(parsedBody, id);

  if (validUser) {
    const newUser: UsersBase = {
      id,
      username: parsedBody.username,
      age: parsedBody.age,
      hobbies: parsedBody.hobbies,
    }
    usersBase = [...usersBase.filter(user => user.id !== id), newUser];
    
    return true;
  }

  return false;
}

export const deleteUser = async (id: string): Promise<boolean> => {
  const userExists = await getUser(id);
  
  if (userExists) {
    usersBase = usersBase.filter(user => user.id !== id);
    
    return true;
  }

  return false;
}

export const validateUser = async (user: Partial<UsersBase>, id: string) => {
  const userExists = await getUser(id);
  return userExists && user.username && user.age && user.hobbies;
}

export const getUser = async (id: string): Promise<UsersBase | undefined> => {
  return usersBase.find(user => user.id === id);
}

export const getUserJSON = async (id: string) => {
  return JSON.stringify(await getUser(id));
}
