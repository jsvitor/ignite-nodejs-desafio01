const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body;

  const userAlreadyExists = users.find(user => user.username == username)
  // IF user not exists, return error message
  if (!userAlreadyExists) {
    return response.status(400).json({ "message": "User not exists" })
  }

  return next()
}

app.post('/users', (request, response) => {
  // Desestruturar o request.body
  const { name, username } = request.body;

  const userAlreadyExists = users.find(user => user.username == username)
  
  if (userAlreadyExists) {
    return response.status(400).json({ "message": "Username already exists" })
  }

  users.push({
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  });

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;