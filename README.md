# Simple CRUD Project

A basic full-stack application demonstrating CRUD operations (Create, Read, Update, Delete) with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **Database**: Supabase (PostgreSQL)

## Project Structure

```
Practice/
├── server.py          # Backend server (Python Flask)
├── requirements.txt   # Python dependencies
├── config.py          # Supabase configuration
├── public/            # Frontend files
│   ├── index.html     # Main HTML page
│   ├── style.css      # Styling
│   └── script.js      # Frontend JavaScript
└── .env.example       # Environment variables template
```

## Features

- ✅ **CREATE**: Add new tasks with title and description
- ✅ **READ**: View all tasks in a list
- ✅ **UPDATE**: Edit existing tasks and mark as completed
- ✅ **DELETE**: Remove tasks from the list
- 🎨 **Simple UI**: Clean, responsive design
- 💾 **Persistent Storage**: Data saved in Supabase (PostgreSQL) database

## How to Run

### 1. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API and copy your Project URL and anon public key
4. Update `config.py` with your Supabase credentials

### 2. Create Database Table
In your Supabase dashboard, go to SQL Editor and run:
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the Backend Server
```bash
python server.py
```

### 5. Open in Browser
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
- `id` - Auto-incrementing primary key (BIGSERIAL)
- `title` - Task title (required)
- `description` - Task description (optional)
- `completed` - Boolean flag for completion status
- `created_at` - Timestamp when task was created (auto-generated)

## What You'll Learn

1. **Frontend**: HTML forms, CSS styling, JavaScript DOM manipulation
2. **Backend**: Flask server setup, REST API endpoints
3. **Database**: Supabase operations with PostgreSQL
4. **Full-Stack**: How frontend and backend communicate via HTTP requests
5. **CRUD Operations**: Complete Create, Read, Update, Delete functionality
6. **Cloud Database**: Working with a real cloud database service

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
- **Database errors**: Check your Supabase credentials in `config.py`
- **CORS issues**: Make sure the backend is running on the correct port
- **Python not found**: Install Python from [python.org](https://python.org)
- **Supabase connection issues**: Verify your URL and key in `config.py`
