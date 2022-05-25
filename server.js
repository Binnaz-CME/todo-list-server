/*
För att uppnå Godkänt är kraven att:
Den ska vara byggd med Node.js och endast dess inbyggda moduler.
Utan NPM (inga node_modules, package.json, package-lock.json)
API:et ska ha följande endpoints:
OK!     GET /todos - Hämta alla todos
OK!     GET /todos/:id - Hämta en todo
OK!     POST /todos - Lägg till en todo
OK!     PUT /todos/:id - Ändra en Todo (full)
OK!     PATCH /todos/:id - Ändra en todo (partial)
OK!     DELETE /todos/:id - Ta bort en todo
Ok!     API:et ska endast ta emot och skicka data i JSON-format
OK!     API:et ska lagra och läsa data från en JSON-fil, så att applikationen bibehåller datan vid omstart eller krasch.
Det ska finnas en tillhörande frontend av valfritt slag (ex. Todo-listen från K1 eller K2)
För att uppnå Väl Godkänt behöver du implementera minst 4 av följande kriterier:

API:et ska svara med lämpligt meddelande och statuskod om allt gått väl
API:et ska svara med lämpligt meddelande och statuskod om routen inte finns
API:et ska svara med lämpligt meddelande och statuskod om resursen inte finns
API:et ska svara med lämpligt meddelande och statuskod om requesten inte är korrekt
API:et ska innehålla en README-fil med tillhörande dokumentation med en lista på varje route och exempel på hur den anropas

*/

const http = require("http");
const fs = require("fs");

const port = 4000;

let todos = [];

const app = http.createServer((req, res) => {
  console.log(`${req.method} till url: ${req.url}`);

  const items = req.url.split("/");

  if (req.method === "GET" && items.length === 2) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    fs.readFile("./todos.json", "utf-8", (err, data) => {
      if (err) throw err;
      todos = JSON.parse(data);
      res.end(JSON.stringify(todos));
    });
  } else if (req.method === "GET" && items.length === 3 && items[2]) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const todoIndex = parseInt(items[2] - 1);
    res.end(JSON.stringify(todos[todoIndex]));
  } else if (req.method === "POST") {
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    req.on("data", (chunk) => {
      const newTodo = JSON.parse(chunk);
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
    const id = parseInt(items[2]);
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
    const id = parseInt(items[2]);
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    req.on("data", (chunk) => {
      const data = JSON.parse(chunk);
      let todo = todos[todoIndex];

      if (data.todo) {
        todo.todo = data.todo;
      }

      if (data.done) {
        todo.done = data.done;
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
    const id = parseInt(items[2]);
    todos = todos.filter((todo) => todo.id !== id);
    const stringTodos = JSON.stringify(todos);
      fs.writeFile("./todos.json", stringTodos, (err) => {
        if (err) throw err;
      });
    res.end();
  }
});

// app.on("error", (e) => {
//   console.log(`problem with request: ${e}`);
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
