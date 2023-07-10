const express = require('express');
const app = express();
const data = require("./data.json");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

app.use(express.json()); // Parse JSON request bodies

app.get('/', (req, res) => {
    res.send('hi from Imngthorsson');
});

// Retrieve a list of games
app.get('/games', async (req, res) => {
    // Retrieve and return the list of games
    res.json(data);
});

// Retrieve a specific game
app.get('/games/:id', (req, res) => {
    const gameId = req.params.id;
    const game = data.find(game => game.id === gameId);

    if (game) {
        res.json(game);
    } else {
        res.status(404).json({ error: 'Game not found' });
    }
});

// Create a new game
app.post('/games', async (req, res) => {
    const { winningNumbers, date } = req.body;

    // Generate a UUID for the new game
    const gameId = uuidv4();

    // Create the new game object
    const newGame = {
        id: gameId,
        winningNumbers: winningNumbers.split(',').map(Number),
        date: new Date(parseInt(date)).toUTCString()
    };

    // Add the new game to the data array
    data.push(newGame);

    // Save the updated data to the file
    fs.writeFile("data.json", JSON.stringify(data), (err) => {
        if (err) throw err;
        res.status(201).json({ message: 'Game created successfully' });
    });
});

// Update the winning numbers of an existing game
app.put('/games/:id', (req, res) => {
    const gameId = req.params.id;
    const { winningNumbers } = req.body;

    // Find the game with the specified ID
    const game = data.find(game => game.id === gameId);

    if (game) {
        // Update the winning numbers of the game
        game.winningNumbers = winningNumbers.split(',').map(Number);

        // Save the updated data to the file
        fs.writeFile("data.json", JSON.stringify(data), (err) => {
            if (err) throw err;
            res.json({ message: 'Winning numbers updated successfully', updatedGame: game });
        });
    } else {
        res.status(404).json({ error: 'Game not found' });
    }
});

// Delete a game
app.delete('/games/:id', (req, res) => {
    const gameId = req.params.id;

    // Find the index of the game with the specified ID
    const gameIndex = data.findIndex(game => game.id === gameId);

    if (gameIndex !== -1) {
        // Remove the game from the data array
        const deletedGame = data.splice(gameIndex, 1);

        // Save the updated data to the file
        fs.writeFile("data.json", JSON.stringify(data), (err) => {
            if (err) throw err;
            res.json({ message: 'Game deleted successfully', deletedGame });
        });
    } else {
        res.status(404).json({ error: 'Game not found' });
    }
});

const port = 3000; // Choose a port number

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});