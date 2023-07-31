//знаходимо елементи на сторінці
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

function addTask(event) {
  // відміна відправки форми
  event.preventDefault();

  // дістати текст задачі з поля вводу
  const taskText = taskInput.value;

  // описуємо задачу в вигляді об'єкту
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // додаємо задачу в масив с задачами
  tasks.push(newTask);

  // зберігаємо список задач в localStorage
  saveToLocalStorage();

  // завантажуємо задачі на сторінці
  renderTask(newTask);

  // чистимо поле вводу і фокусуємось на input
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // перевіряємо, що клік був НЕ по кнопці 'delete'
  if (event.target.dataset.action !== "delete") return;

  const parenNode = event.target.closest(".list-group-item");

  // визначаємо ID задачі
  const id = Number(parenNode.id);

  // видаляємо задачу через фільтр массива
  tasks = tasks.filter((task) => task.id !== id);

  // зберігаємо список задач в localStorage
  saveToLocalStorage();

  //видаляємо задачу з розмітки
  parenNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  //перевіряємо, що клік був НЕ по кнопці 'done'
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-group-item");

  // визначаємо ID задачі
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  // зберегти стисок задач в localStorage
  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
          <div class="empty-list__icon">	<img src="img/leaf.svg" alt="Empty" width="48" class="mt-3"></div>
					<div class="empty-list__title">Список справ пустий</div>
				</li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // формуємо CSS клас
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // формуємо розмітку для нової задачі
  const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="img/tick.png" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="img/cross.png" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

  // додаємо задачу на сторінку
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
