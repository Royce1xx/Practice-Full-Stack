// API base URL
const API_URL = 'http://localhost:5000/api';

// DOM elements
const addTaskForm = document.getElementById('addTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const editForm = document.getElementById('editForm');
const tasksList = document.getElementById('tasksList');
const themeToggle = document.getElementById('themeToggle');

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Loading state management
function setLoading(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (isLoading) {
        submitButton.classList.add('btn-loading');
        submitButton.disabled = true;
        form.classList.add('loading');
    } else {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        form.classList.remove('loading');
    }
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Initialize theme
initTheme();

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task form submission
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    // Set loading state
    setLoading(addTaskForm, true);

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
            await loadTasks();
            showNotification('Task created successfully! 🎉');
        } else {
            const error = await response.json();
            showNotification('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    } finally {
        // Clear loading state
        setLoading(addTaskForm, false);
    }
});

// Edit task form submission
editTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value;
    const description = document.getElementById('editTaskDescription').value;
    const completed = document.getElementById('editTaskCompleted').checked;

    // Set loading state
    setLoading(editTaskForm, true);

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
            await loadTasks();
            showNotification('Task updated successfully! ✨');
        } else {
            const error = await response.json();
            showNotification('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    } finally {
        // Clear loading state
        setLoading(editTaskForm, false);
    }
});

// Load all tasks
async function loadTasks() {
    try {
        // Show loading state
        tasksList.innerHTML = '<div class="loading-state"><div class="spinner"></div> Loading tasks...</div>';

        const response = await fetch(`${API_URL}/tasks`);
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            tasksList.innerHTML = '<p class="error-message">Error loading tasks</p>';
        }
    } catch (error) {
        tasksList.innerHTML = '<p class="error-message">Error: ' + error.message + '</p>';
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
            await loadTasks();
            showNotification('Task deleted successfully! 🗑️');
        } else {
            const error = await response.json();
            showNotification('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}
