const todos_container = document.querySelector('[data-todos]');
const todo_form = document.getElementById('todo_form');
const clear_todos = document.getElementById('clear_todos');
const remove_todo = document.getElementById('remove_todo');
const tasks_container = document.querySelector('[data-tasks]');
const task_form = document.getElementById('task_form');
const task_template = document.getElementById('task_template');


const LOCAL_STORAGE_TODOS = 'todo.todos';
const LOCAL_STORAGE_SELECTED_TODO = 'todo.selectedTodo';
let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS)) || [];
let selected_todo_id = localStorage.getItem(LOCAL_STORAGE_SELECTED_TODO);

todos_container.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'li') {
        selected_todo_id = event.target.dataset.todoId;
        renderTodo();
        save();
    }
})

clear_todos.addEventListener('click', () => {
    localStorage.clear();
    renderTodo();
})

remove_todo.addEventListener('click', () => {
    todos = todos.filter(todos => todos.id !== selected_todo_id);
    selected_todo_id = null;
    renderTodo();
    save();
})

todo_form.addEventListener('submit', event => {
    event.preventDefault();
    const todo_input = document.getElementById('todo_input');
    const todo = createTodo(todo_input.value);
    todos.push(todo);
    todo_input.value = null;
    const new_todo = document.createElement('li');
    new_todo.innerText = todo;
    todos_container.appendChild(new_todo);
    save();
    renderTodo();
})

function createTodo(name) {
    const date = new Date();
    const days_of_week = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ]
    const months_of_the_year = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'July', 'August', 'September',
        'October', 'November', 'December'
    ]
    return {
        id: Date.now().toString(),
        date: `${days_of_week[date.getDay()]} ${months_of_the_year[date.getMonth()]}, ${date.getDate()} --- `,
        name: name,
        tasks: []
    }
}

task_form.addEventListener('submit', event => {
    event.preventDefault();
    const task_input = document.getElementById('task_input');
    const task = createTask(task_input.value);
    const selected_todo = todos.find(todo => todo.id === selected_todo_id);
    selected_todo.tasks.push(task);
    task_input.value = null;
    renderTask();
    save();
})

function createTask(task) {
    return {
        id: Date.now().toString(),
        name: task,
        complete: false
    }
}

renderTodo();
renderTask();
function renderTodo() {
    clearContainer(todos_container)
    todos.forEach(todo => {
        const each_todo = document.createElement('li');
        each_todo.innerText = `${todo.date} ${todo.name}`;
        each_todo.dataset.todoId = todo.id;
        todos_container.appendChild(each_todo);
        if (todo.id === selected_todo_id) {
            each_todo.classList.add('selected_item');
        }
    })
}

function renderTask() {
    clearContainer(tasks_container);
    const selected_todo = todos.find(todo => todo.id === selected_todo_id);
    selected_todo.tasks.forEach(task => {
        const each_task = document.importNode(task_template.content, true);
        const checkbox = each_task.querySelector('input');
        checkbox.id = task.id;
        checkbox.checkbox = task.complete;
        const label = each_task.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasks_container.appendChild(each_task);
    })
}

function clearContainer(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_TODOS, JSON.stringify(todos));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TODO, selected_todo_id);
}