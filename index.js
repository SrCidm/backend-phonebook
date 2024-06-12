const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require('dotenv').config()

const { Person } = require("./models/person")

app.use(cors());
app.use(express.static('dist'));

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
    Person.find({})
        .then(persons => {
            res.json(persons);
        })
        .catch(error => next(error));
});

app.get("/info", (req, res) => {
    Person.countDocuments({})
        .then(count => {
            const currentDate = new Date();
            const info = `<p>PhoneBook has info for ${count} people</p><p>${currentDate}</p>`;
            res.send(info);
        })
        .catch(error => next(error));
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).send({ error: "Person not found" })
            }
        })
        .catch(error => next(error))
});


app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(204).end();
                console.log("Person deleted");
            } else {
                res.status(404).send({ error: "Person not found" });
            }
        })
        .catch(error => next(error))
});

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: "Name or number is missing" });
    }
    if (!/^\d{2,3}-\d+$/.test(body.number)) {
        return res.status(400).json({ error: "This is not a valid phone number. The format should be xx-xxxxxxx or xxx-xxxxxxx." });
    }

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return res.status(400).json({ error: "Name must be unique" });
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number,
                });

                person.save()
                    .then(savedPerson => {
                        res.json(savedPerson);
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
});

app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    if (!body.number) {
        return res.status(400).json({ error: "Number is missing" });
    };
    const updatedPerson = {
        number: body.number,
    };
    Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true, context: "query" })
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson);
            } else {
                res.status(404).send({ error: "Person not found" });
            }
        })
        .catch(error => next(error));
});

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === "ValidationError") {
        return res.status(400).json({error: error.message})
    }
    if (error.name === "ResourceNotFoundError") {
        return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "An unexpected error ocurred" });
    next(error);
}

app.use(errorHandler);


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});