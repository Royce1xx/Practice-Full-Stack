from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from datetime import datetime
import config

app = Flask(__name__)
app.static_folder = 'public'
app.static_url_path = ''
CORS(app)

# Supabase setup
def create_supabase_client():
    try:
        client = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
        print(f"✅ Connected to Supabase at: {config.SUPABASE_URL}")
        return client
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        print("Check your credentials in config.py")
        return None

# Database setup - create table if it doesn't exist
def init_db():
    try:
        # Test the connection
        client = create_supabase_client()
        if client:
            # Try to access the tasks table to see if it exists
            response = client.table('tasks').select('id').limit(1).execute()
            print("✅ Database connection successful")
            print("✅ Tasks table accessible")
        else:
            print("❌ Cannot initialize database - Supabase connection failed")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        print("Make sure to create the 'tasks' table in your Supabase dashboard")

# Initialize database when app starts
init_db()

# Get the Supabase client
supabase = create_supabase_client()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/style.css')
def css():
    return app.send_static_file('style.css')

@app.route('/script.js')
def js():
    return app.send_static_file('script.js')

# GET all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    if not supabase:
        return jsonify({'error': 'Database connection not available'}), 500
    
    try:
        response = supabase.table('tasks').select('*').order('created_at', desc=True).execute()
        tasks = response.data
        return jsonify(tasks)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET single task by ID
@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    try:
        response = supabase.table('tasks').select('*').eq('id', task_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Task not found'}), 404
        
        task = response.data[0]
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
        
        new_task = {
            'title': title,
            'description': description,
            'completed': False
        }
        
        response = supabase.table('tasks').insert(new_task).execute()
        created_task = response.data[0]
        
        return jsonify(created_task), 201
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
        
        update_data = {
            'title': title,
            'description': description,
            'completed': completed
        }
        
        response = supabase.table('tasks').update(update_data).eq('id', task_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify({'message': 'Task updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        response = supabase.table('tasks').delete().eq('id', task_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Server running on http://localhost:5000")
    print("Database: Supabase (PostgreSQL)")
    app.run(debug=True, port=5000)
