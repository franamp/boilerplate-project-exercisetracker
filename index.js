const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

let users = [];
let exercises = [];

app.post('/api/users', (req, res) => {
    const { username } = req.body;
    const user = {
        username,
        _id: uuidv4()
    };
    users.push(user);
    res.json(user);
});

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users/:id/exercises', (req, res) => {
    const { id } = req.params;
    const { description, duration, date } = req.body;

    const user = users.find(user => user._id === id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const exercise = {
        username: user.username,
        description,
        duration: Number(duration),
        date: date ? new Date(date).toDateString() : new Date().toDateString(),
        _id: uuidv4()
    };

    exercises.push(exercise);
    res.json(exercise);
});

app.get('/api/users/:id/logs', (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user._id === id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userExercises = exercises.filter(exercise => exercise.username === user.username);

    const log = userExercises.map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
    }));

    res.json({
        username: user.username,
        count: log.length,
        _id: user._id,
        log
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
