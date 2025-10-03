// Smart Task Manager JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        const appContainer = document.getElementById('app-container');
        
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            appContainer.style.display = 'flex';
            appContainer.style.animation = 'fadeInUp 0.8s ease-out';
            initializeApp();
        }, 500);
    }, 3000);
});

let tasks = [
    { id: 1, title: 'Design Homepage Layout', description: 'Create wireframes and mockups', priority: 'high', status: 'pending', project: 'website', dueDate: '2024-01-15', completed: false },
    { id: 2, title: 'API Integration', description: 'Connect frontend with backend APIs', priority: 'urgent', status: 'pending', project: 'mobile', dueDate: '2024-01-12', completed: false },
    { id: 3, title: 'User Testing', description: 'Conduct usability tests', priority: 'medium', status: 'completed', project: 'website', dueDate: '2024-01-10', completed: true },
    { id: 4, title: 'Database Optimization', description: 'Improve query performance', priority: 'high', status: 'pending', project: 'mobile', dueDate: '2024-01-18', completed: false },
    { id: 5, title: 'Marketing Campaign', description: 'Launch social media campaign', priority: 'low', status: 'pending', project: 'marketing', dueDate: '2024-01-20', completed: false }
];

let currentView = 'dashboard';
let currentFilter = 'all';

function initializeApp() {
    initializeNavigation();
    initializeEventListeners();
    renderDashboard();
    animateStats();
}

function initializeNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            switchView(view);
        });
    });
}

function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(view + 'View').classList.add('active');
    
    const titles = {
        dashboard: 'Dashboard',
        tasks: 'My Tasks',
        projects: 'Projects',
        calendar: 'Calendar',
        team: 'Team',
        analytics: 'Analytics'
    };
    
    const subtitles = {
        dashboard: "Welcome back! Here's what's happening with your tasks.",
        tasks: 'Manage and organize your tasks efficiently.',
        projects: 'Overview of all your active projects.',
        calendar: 'Schedule and timeline view of your tasks.',
        team: 'Collaborate with your team members.',
        analytics: 'Insights and performance metrics.'
    };
    
    document.getElementById('pageTitle').textContent = titles[view];
    document.getElementById('pageSubtitle').textContent = subtitles[view];
    
    if (view === 'tasks') {
        renderTasks();
    }
    
    currentView = view;
}

function initializeEventListeners() {
    document.getElementById('addTaskBtn').addEventListener('click', openAddTaskModal);
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    
    const modal = document.getElementById('addTaskModal');
    const closeBtn = modal.querySelector('.close-btn');
    
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    document.getElementById('sortTasks').addEventListener('change', renderTasks);
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
}

function renderDashboard() {
    renderRecentTasks();
    updateTaskCounts();
}

function renderRecentTasks() {
    const recentTasksList = document.getElementById('recentTasksList');
    const recentTasks = tasks.slice(0, 5);
    
    recentTasksList.innerHTML = recentTasks.map(task => `
        <div class="task-item" onclick="toggleTask(${task.id})">
            <div class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span>Due: ${formatDate(task.dueDate)}</span>
                    <span>${task.project || 'No Project'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTasks() {
    const tasksContainer = document.getElementById('tasksContainer');
    let filteredTasks = tasks;
    
    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => {
            switch(currentFilter) {
                case 'pending': return !task.completed;
                case 'completed': return task.completed;
                case 'overdue': return new Date(task.dueDate) < new Date() && !task.completed;
                default: return true;
            }
        });
    }
    
    const sortBy = document.getElementById('sortTasks').value;
    filteredTasks.sort((a, b) => {
        switch(sortBy) {
            case 'priority':
                const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'date':
                return new Date(a.dueDate) - new Date(b.dueDate);
            case 'name':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
    
    tasksContainer.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">
            <div class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span>Due: ${formatDate(task.dueDate)}</span>
                    <span>${task.project || 'No Project'}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn" onclick="editTask(${task.id}); event.stopPropagation();">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteTask(${task.id}); event.stopPropagation();">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateTaskCounts() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && !t.completed).length;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('overdueTasks').textContent = overdue;
    
    document.querySelector('[data-view="tasks"] .task-count').textContent = pending;
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-content h3');
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 30;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentValue);
        }, 50);
    });
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'pending';
        
        if (currentView === 'dashboard') {
            renderDashboard();
        } else if (currentView === 'tasks') {
            renderTasks();
        }
        updateTaskCounts();
    }
}

function openAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'block';
    document.getElementById('taskTitle').focus();
}

function closeModal() {
    document.getElementById('addTaskModal').style.display = 'none';
    document.getElementById('taskForm').reset();
}

function handleTaskSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newTask = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value,
        project: document.getElementById('taskProject').value,
        status: 'pending',
        completed: false
    };
    
    tasks.unshift(newTask);
    closeModal();
    
    if (currentView === 'dashboard') {
        renderDashboard();
    } else if (currentView === 'tasks') {
        renderTasks();
    }
    updateTaskCounts();
    
    showNotification('Task created successfully!', 'success');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        
        if (currentView === 'dashboard') {
            renderDashboard();
        } else if (currentView === 'tasks') {
            renderTasks();
        }
        updateTaskCounts();
        
        showNotification('Task deleted successfully!', 'success');
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate;
        document.getElementById('taskProject').value = task.project;
        
        openAddTaskModal();
        
        const form = document.getElementById('taskForm');
        form.onsubmit = function(e) {
            e.preventDefault();
            
            task.title = document.getElementById('taskTitle').value;
            task.description = document.getElementById('taskDescription').value;
            task.priority = document.getElementById('taskPriority').value;
            task.dueDate = document.getElementById('taskDueDate').value;
            task.project = document.getElementById('taskProject').value;
            
            closeModal();
            
            if (currentView === 'dashboard') {
                renderDashboard();
            } else if (currentView === 'tasks') {
                renderTasks();
            }
            
            showNotification('Task updated successfully!', 'success');
            
            form.onsubmit = handleTaskSubmit;
        };
    }
}

function createQuickTask(type) {
    const quickTasks = {
        meeting: { title: 'Team Meeting', description: 'Weekly team sync meeting', priority: 'medium' },
        reminder: { title: 'Set Reminder', description: 'Important reminder task', priority: 'low' },
        project: { title: 'New Project', description: 'Start new project planning', priority: 'high' },
        team: { title: 'Invite Team Member', description: 'Send team invitation', priority: 'medium' }
    };
    
    const taskTemplate = quickTasks[type];
    const newTask = {
        id: Date.now(),
        ...taskTemplate,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        project: '',
        status: 'pending',
        completed: false
    };
    
    tasks.unshift(newTask);
    renderDashboard();
    updateTaskCounts();
    
    showNotification(`${taskTemplate.title} created!`, 'success');
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : 'var(--primary-purple)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: var(--shadow-card);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .task-item.completed .task-title {
        text-decoration: line-through;
        opacity: 0.6;
    }
    
    .task-actions {
        display: flex;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .task-item:hover .task-actions {
        opacity: 1;
    }
    
    .action-btn {
        background: rgba(108, 92, 231, 0.2);
        border: none;
        border-radius: 6px;
        padding: 0.5rem;
        color: var(--primary-purple);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .action-btn:hover {
        background: var(--primary-purple);
        color: white;
    }
`;
document.head.appendChild(style);