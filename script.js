let currentBoxId = null;

// Load tasks from localStorage when the page is refreshed
window.addEventListener("load", loadTasks());

// add task with popup rather than prompt for edit i am using prompt
function openAddBox(boxId) {
  currentBoxId = boxId;
  document.getElementById("add-popup").style.display = "flex";
}
function closeAddBox() {
  document.getElementById("add-popup").style.display = "none";
}


//add a task
function addTask() {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  if (taskText === "") return;

  const task = {
    id: Math.random().toString(16).slice(2), // obtain unique ID for the task
    text: taskText,
    box: currentBoxId,
  };
  saveTask(task);
  addTaskToBox(task);
  input.value = "";
  closeAddBox();
}

//save a task to localStorage
function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//load tasks from localStorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTaskToBox(task));
}
function addTaskToBox(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card slide-in";
  taskCard.draggable = true;
  taskCard.dataset.id = task.id; // Store the task ID for reference
  taskCard.innerHTML = `
    <div class="task-text">${task.text}</div>
    <div class="task-buttons">
      <button class="edit-button" onclick="editTask(this)">Edit</button>
      <button class="delete-button" onclick="deleteTask(this)">Delete</button>
    </div>
  `;

  document.getElementById(`${task.box}-tasks`).appendChild(taskCard);
  addDragAndDrop(taskCard);
}

//edit a task
function editTask(button) {
  const taskCard = button.closest(".task-card");
  const taskText = taskCard.querySelector(".task-text");
  const newText = prompt("Edit your task:", taskText.innerText);
  if (newText !== null && newText.trim() !== "") {
    taskText.innerText = newText.trim();
    updateTaskInLocalStorage(taskCard.dataset.id, newText.trim());
  }
}

// update a task in localStorage
function updateTaskInLocalStorage(taskId, newText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => {
    if (task.id == taskId) {
      task.text = newText;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//delete a task
function deleteTask(button) {
  const taskCard = button.closest(".task-card");
  const taskId = taskCard.dataset.id;
  taskCard.remove();
  deleteTaskFromLocalStorage(taskId);
}


//delete a task from localStorage
function deleteTaskFromLocalStorage(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id != taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Drag and drop
function addDragAndDrop(taskCard) {
  taskCard.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", taskCard.dataset.id);
    setTimeout(() => (taskCard.style.display = "none"), 0);
  });
  taskCard.addEventListener("dragend", () => {
    taskCard.style.display = "flex";
  });
}
const boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  box.addEventListener("drop", (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const taskCard = document.querySelector(`.task-card[data-id='${taskId}']`);
    taskCard.remove();
    box.querySelector(".task-list").appendChild(taskCard);
    updateTaskBoxInLocalStorage(taskId, box.id);
  });
});

//update a task box in localStorage
function updateTaskBoxInLocalStorage(taskId, newBoxId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => {
    if (task.id == taskId) {
      task.box = newBoxId;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}