const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('tasks.db');

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// GET single task by ID
app.get('/api/tasks/:id', (req, res) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json(row);
    });
});

// POST create new task
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    db.run(
        'INSERT INTO tasks (title, description) VALUES (?, ?)',
        [title, description],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({
                id: this.lastID,
                title,
                description,
                completed: false,
                created_at: new Date().toISOString()
            });
        }
    );
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
    const { title, description, completed } = req.body;

    db.run(
        'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
        [title, description, completed ? 1 : 0, req.params.id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json({ message: 'Task updated successfully' });
        }
    );
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Database: tasks.db');
});
