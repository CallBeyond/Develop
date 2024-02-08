const express = require('express');
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");

const PORT = process.env.PORT || 3001;
const app = express();

// Serve static files from the public directory
app.use(express.static("public"));

// Parse JSON bodies
app.use(express.json());

// Route to serve notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API route to retrieve all notes from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (error, data) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return;
        }
        res.json(JSON.parse(data));
    });
});

// API route to add a new note to db.json
app.post('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (error, data) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return;
        }
        const notes = JSON.parse(data);
        const newNote = {
            ...req.body,
            id: uniqid()
        };
        notes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (error) => {
            if (error) {
                res.status(500).send("Internal Server Error");
                return;
            }
            res.json(newNote);
        });
    });
});

// API route to delete a note from db.json by ID
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (error, data) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return;
        }
        const notes = JSON.parse(data);
        const filterNotes = notes.filter(note => note.id !== req.params.id);
        fs.writeFile("./db/db.json", JSON.stringify(filterNotes), (error) => {
            if (error) {
                res.status(500).send("Internal Server Error");
                return;
            }
            res.send("Note deleted");
        });
    });
});

// Route to serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});
