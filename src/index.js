const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userAlreadyExists = users.find(user => user.username == username)
  
  // IF user not exists, return error message
  if (!userAlreadyExists) {
    return response.status(400).json({ error: "User not exists" })
  }
  request.user = userAlreadyExists;
  return next();
}

app.post('/users', (request, response) => {
  // Desestruturar o request.body
  const { name, username } = request.body;

  const userAlreadyExists = users.find(user => user.username == username)
  
  if (userAlreadyExists) {
    return response.status(400).json({ error: "Username already exists" })
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  };
  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Lista Todos
  return response.status(201).json(request.user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Cria Todos
  const { title, deadline } = request.body;

  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  request.user.todos.push(task)

  return response.status(201).json(task)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Atualizar o um ToDo
  const { title, deadline } = request.body;
  const { id } = request.params;

  const task = request.user.todos.find(task => task.id == id);
  task.title = title;
  task.deadline = new Date(deadline);
  return response.status(201).json(task);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Add done to task
  const { id } = request.params;
  const task = request.user.todos.find(task => task.id == id);
  task.done = true;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Delete a task
  const { id } = request.params;
  const task = request.user.todos.findIndex(task => task.id == id);
  request.user.todos.splice(task, 1)
  return response.status(201).send()
});

module.exports = app;