from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database when app starts
init_db()

@app.route('/')
def index():
    return app.send_static_file('index.html')

# GET all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        conn = sqlite3.connect('tasks.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks ORDER BY created_at DESC')
        rows = cursor.fetchall()
        
        tasks = []
        for row in rows:
            tasks.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'completed': bool(row[3]),
                'created_at': row[4]
            })
        
        conn.close()
        return jsonify(tasks)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET single task by ID
@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    try:
        conn = sqlite3.connect('tasks.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row is None:
            return jsonify({'error': 'Task not found'}), 404
        
        task = {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'completed': bool(row[3]),
            'created_at': row[4]
        }
        return jsonify(task)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# POST create new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description', '')
        
        if not title:
            return jsonify({'error': 'Title is required'}), 400
        
        conn = sqlite3.connect('tasks.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            (title, description)
        )
        task_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        new_task = {
            'id': task_id,
            'title': title,
            'description': description,
            'completed': False,
            'created_at': datetime.now().isoformat()
        }
        return jsonify(new_task), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# PUT update task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description', '')
        completed = data.get('completed', False)
        
        conn = sqlite3.connect('tasks.db')
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
            (title, description, 1 if completed else 0, task_id)
        )
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Task updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        conn = sqlite3.connect('tasks.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Server running on http://localhost:5000")
    print("Database: tasks.db")
    app.run(debug=True, port=5000)
