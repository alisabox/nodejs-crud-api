# Simple CRUD API on vanilla Node.js

---

To **install** the project, run the following commands:

```
git clone https://github.com/alisabox/nodejs-crud-api.git
cd nodejs-crud-api
npm install
```

Then, switch to the develop branch with `git checkout develop`

To **run** the application, use one the following commands:

- for development mode
  ```
  npm run start:dev
  ```
- for production mode
  ```
  npm run start:prod
  ```
- to run the application with load balancers
  ```
  npm run start:multi
  ```

To **test** the application, use the following command:

```
npm run test
```

---

The server runs on port `http://localhost:5000/api/users` and allows manipulations with in-memory database of users.

The server accepts:

- GET and POST requests on port `http://localhost:5000/api/users`
- GET, PUT and DELETE requests on port `http://localhost:5000/api/users/${userId}`

The mandatory fields for POST and PUT operations:

```
{
  username: string,
  age: number,
  hobbies: string[]
}
```

---

The application uses the following packages:

- `nodemon`, `webpack`, `typescript` and their plugins
- `dotenv`
- `prettier`
- `uuid`
- `jest` and `supertest` for testing
