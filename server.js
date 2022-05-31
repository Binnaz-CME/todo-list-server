const http = require("http");
const fs = require("fs");

const port = 4000;

let todos = [];

fs.readFile("./todos.json", "utf-8", (err, data) => {
  if (err) throw err;
  todos = JSON.parse(data);
});

const app = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PATCH, DELETE, OPTIONS, POST, PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  const items = req.url.split("/");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
  }

  if (req.method === "GET" && items.length === 2) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(todos));
  } else if (req.method === "GET" && items.length === 3 && items[2]) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const id = items[2];
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    res.end(JSON.stringify(todos[todoIndex]));
  } else if (req.method === "POST") {
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    req.on("data", (chunk) => {
      let newTodo = JSON.parse(chunk);
      newTodo = {
        id: Math.random().toString(36).slice(2),
        todo: newTodo.todo,
        isDone: false,
      };
      todos.push(newTodo);
      const stringTodos = JSON.stringify(todos);
      fs.writeFile("./todos.json", stringTodos, (err) => {
        if (err) throw err;
      });
    });
    res.end();
  } else if (req.method === "PUT") {
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    const id = items[2];
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    req.on("data", (chunk) => {
      const replacementTodo = JSON.parse(chunk);
      todos[todoIndex] = replacementTodo;
      const stringTodos = JSON.stringify(todos);
      fs.writeFile("./todos.json", stringTodos, (err) => {
        if (err) throw err;
      });
    });
    res.end();
  } else if (req.method === "PATCH") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode == 200;
    const id = items[2];
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    req.on("data", (chunk) => {
      const data = JSON.parse(chunk);
      let todo = todos[todoIndex];

      if (typeof data.isDone === "boolean") {
        todo.isDone = data.isDone;
      }

      if (data.todo) {
        todo.todo = data.todo;
      }

      todos[todoIndex] = todo;
      const stringTodos = JSON.stringify(todos);
      fs.writeFile("./todos.json", stringTodos, (err) => {
        if (err) throw err;
      });
    });
    res.end();
  } else if (req.method === "DELETE") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 204;
    const id = items[2];
    todos = todos.filter((todo) => todo.id !== id);
    const stringTodos = JSON.stringify(todos);
    fs.writeFile("./todos.json", stringTodos, (err) => {
      if (err) throw err;
    });
    res.end();
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error(`Error while starting server: ${err}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
