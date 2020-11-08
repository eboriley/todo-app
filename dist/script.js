const todos_container = document.querySelector('[data-todos]');
const todo_form = document.getElementById('todo_form');
const clear_todos = document.getElementById('clear_todos');
const remove_todo = document.getElementById('remove_todo');


const LOCAL_STORAGE_TODOS = 'todo.todos';
const LOCAL_STORAGE_SELECTED_TODO = 'todo.selectedTodo';
let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS)) || [];
let selectedTodo = localStorage.getItem(LOCAL_STORAGE_SELECTED_TODO);

todos_container.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'li') {
        selectedTodo = event.target.dataset.todoId;
        render();
        save();
    }
})

clear_todos.addEventListener('click', () => {
    localStorage.clear();
    render();
})

remove_todo.addEventListener('click', () => {
    todos = todos.filter(todos => todos.id !== selectedTodo);
    selectedTodo = null;
    render();
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
    render();
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


render();

function render() {
    clearTodoContainer(todos_container)
    todos.forEach(todo => {
        const each_todo = document.createElement('li');
        each_todo.innerText = `${todo.date} ${todo.name}`;
        each_todo.dataset.todoId = todo.id;
        todos_container.appendChild(each_todo);
        if (todo.id === selectedTodo) {
            each_todo.classList.add('selected_item');
        }
    })
}

function clearTodoContainer(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_TODOS, JSON.stringify(todos));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TODO, selectedTodo);
}