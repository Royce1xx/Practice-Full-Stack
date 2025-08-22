# Simple CRUD Project

A basic full-stack application demonstrating CRUD operations (Create, Read, Update, Delete) with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **Database**: SQLite

## Project Structure

```
Practice/
├── server.py          # Backend server (Python Flask)
├── requirements.txt   # Python dependencies
├── public/            # Frontend files
│   ├── index.html     # Main HTML page
│   ├── style.css      # Styling
│   └── script.js      # Frontend JavaScript
└── tasks.db           # SQLite database (created automatically)
```

## Features

- ✅ **CREATE**: Add new tasks with title and description
- ✅ **READ**: View all tasks in a list
- ✅ **UPDATE**: Edit existing tasks and mark as completed
- ✅ **DELETE**: Remove tasks from the list
- 🎨 **Simple UI**: Clean, responsive design
- 💾 **Persistent Storage**: Data saved in SQLite database

## How to Run

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Backend Server
```bash
python server.py
```

### 3. Open in Browser
Navigate to: `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update existing task |
| DELETE | `/api/tasks/:id` | Delete task |

## Database Schema

The `tasks` table has these columns:
- `id` - Auto-incrementing primary key
- `title` - Task title (required)
- `description` - Task description (optional)
- `completed` - Boolean flag for completion status
- `created_at` - Timestamp when task was created

## What You'll Learn

1. **Frontend**: HTML forms, CSS styling, JavaScript DOM manipulation
2. **Backend**: Flask server setup, REST API endpoints
3. **Database**: SQLite operations (INSERT, SELECT, UPDATE, DELETE)
4. **Full-Stack**: How frontend and backend communicate via HTTP requests
5. **CRUD Operations**: Complete Create, Read, Update, Delete functionality

## Next Steps

Once you understand this basic setup, you can:
- Add user authentication
- Use a different database (PostgreSQL, MySQL, MongoDB)
- Add more complex data relationships
- Implement real-time updates with WebSockets
- Add input validation and error handling
- Create a mobile app version

## Troubleshooting

- **Port already in use**: Change the port in `server.py` (line 108)
- **Database errors**: Delete `tasks.db` file and restart server
- **CORS issues**: Make sure the backend is running on the correct port
- **Python not found**: Install Python from [python.org](https://python.org)
