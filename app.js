const STORAGE_KEY = "todo-app.todos";

const form = document.getElementById("new-todo-form");
const input = document.getElementById("new-todo-input");
const list = document.getElementById("todo-list");
const footer = document.getElementById("footer");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear-completed");

let todos = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: trimmed,
    done: false,
  });
  save();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  save();
  render();
}

function render() {
  list.innerHTML = "";

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.setAttribute("aria-label", "Delete todo");
    del.textContent = "\u00D7";
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, del);
    list.append(li);
  }

  const remaining = todos.filter((t) => !t.done).length;
  countEl.textContent =
    remaining + " " + (remaining === 1 ? "item" : "items") + " left";
  footer.hidden = todos.length === 0;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = "";
  input.focus();
});

clearBtn.addEventListener("click", clearCompleted);

render();
