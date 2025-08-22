// API base URL
const API_URL = 'http://localhost:5000/api';

// DOM elements
const addTaskForm = document.getElementById('addTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const editForm = document.getElementById('editForm');
const tasksList = document.getElementById('tasksList');

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task form submission
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            // Clear form
            addTaskForm.reset();
            // Reload tasks
            loadTasks();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Edit task form submission
editTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value;
    const description = document.getElementById('editTaskDescription').value;
    const completed = document.getElementById('editTaskCompleted').checked;

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, completed })
        });

        if (response.ok) {
            // Hide edit form
            editForm.style.display = 'none';
            // Reload tasks
            loadTasks();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            tasksList.innerHTML = '<p>Error loading tasks</p>';
        }
    } catch (error) {
        tasksList.innerHTML = '<p>Error: ' + error.message + '</p>';
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>No tasks yet. Add one above!</p>';
        return;
    }

    const tasksHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <div class="task-actions">
                    <button class="btn-edit" onclick="editTask(${task.id}, '${task.title}', '${task.description || ''}', ${task.completed})">
                        Edit
                    </button>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-meta">
                Created: ${new Date(task.created_at).toLocaleString()}
                ${task.completed ? ' | Completed' : ''}
            </div>
        </div>
    `).join('');

    tasksList.innerHTML = tasksHTML;
}

// Edit task - show edit form
function editTask(id, title, description, completed) {
    document.getElementById('editTaskId').value = id;
    document.getElementById('editTaskTitle').value = title;
    document.getElementById('editTaskDescription').value = description;
    document.getElementById('editTaskCompleted').checked = completed;

    editForm.style.display = 'block';
    editForm.scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit
function cancelEdit() {
    editForm.style.display = 'none';
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Reload tasks
            loadTasks();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
