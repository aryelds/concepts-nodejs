const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateID(request, response, next) {
    const { id } = request.params;

   if(!isUuid(id)) {
       return response.status(400).json({"error": "Invalid ID!"});
   }

    return  next();
}

app.use('/repositories/:id', validateID);

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const likes = 0;
    const repository = {id: uuid(), title, url, techs, likes};

    repositories.push(repository);

    return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;
    const index = repositories.findIndex((repo) => repo.id === id);

    if (index < 0) {
        return response.status(400).send('ID not found');
    }

    const likes = repositories[index]['likes'];
    const repository = { id,title, url, techs, likes};

    repositories[index] = repository;

    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const index = repositories.findIndex((repo) => repo.id === id);

    if (index < 0) {
        return response.status(400).send('ID not found');
    }

    repositories.splice(index, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", validateID, (request, response) => {
    const { id } = request.params;
    const index = repositories.findIndex((repo) => repo.id === id);

    if (index < 0) {
        return response.status(400).send('ID not found');
    }

    let likes = repositories[index].likes;
    likes++;

    repositories[index]["likes"] = likes;

    response.status(200).json(repositories[index]);
});

module.exports = app;
