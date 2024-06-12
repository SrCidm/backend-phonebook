const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require('dotenv').config()

const Person = require("./models/person")

app.use(cors());
app.use(express.static('dist'))
morgan.token("post-data", function (req, res) {
    if (req.method === "POST") {
        const { name, number } = req.body;
        return `name: ${name}, number: ${number}`;
    }
    return "-";
})

app.use(morgan(":method :url :status :response-time ms - :post-data"))

app.use(express.json());

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",

    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39445323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "39445323523",
    },
    {
        id: 4,
        name: "Mary Poppdieck",
        number: "39445323523",
    }
];

app.get("/", (req, res) => {
    res.send("<h1>PhoneBook-BackEnd<h1>")
})
app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
    const currentDate = new Date();
    const info = `<p>PhoneBook has info for ${persons.length} people</p><p>${currentDate}</p>`;
    res.send(info);
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: "Person not found" })
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const initialLength = persons.length;
    persons = persons.filter(person => person.id !== id);

    if (persons.length < initialLength) {
        res.status(204).end();
        console.log("Person deleted")
    } else {
        res.status(404).send({ error: "Person not found" });
    }
});

app.post("/api/persons", (req, res) => {
    console.log(req.body)
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({error: "Name or number is missing"})
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return res.status(400).json({ error: "Name must be unique" });
    }
    const newPerson = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number,
    };
    persons = persons.concat(newPerson);
    res.json(newPerson);
    console.log("Person added:", newPerson)
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === "ValidationError") {
        return res.status(400).json({error: error.message})
    }
    if (error.name === "ResourceNotFoundError") {
        return res.status(404).json({ error: error.message });
    }
    next(error);
}

app.use(errorHandler);


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});