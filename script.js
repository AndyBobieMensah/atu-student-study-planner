// Get the HTML elements that JavaScript needs to work with.
const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskSubjectInput = document.getElementById("taskSubject");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const formMessage = document.getElementById("formMessage");
const taskFilter = document.getElementById("taskFilter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

// Load previously saved tasks. If there are none, start with an empty array.
let tasks = JSON.parse(localStorage.getItem("studyPlannerTasks")) || [];

// Save the current tasks in the browser.
function saveTasks() {
    localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
}

// Update the three task counters.
function updateSummary() {
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    pendingCount.textContent = tasks.length - completed;
}

// Display the tasks on the page.
function displayTasks() {
    taskList.innerHTML = "";

    const selectedFilter = taskFilter.value;

    const visibleTasks = tasks.filter(function(task) {
        if (selectedFilter === "pending") {
            return !task.completed;
        }

        if (selectedFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    emptyMessage.style.display = visibleTasks.length === 0 ? "block" : "none";

    visibleTasks.forEach(function(task) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("done");
        }

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as complete");

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        const textContainer = document.createElement("div");

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        const subject = document.createElement("span");
        subject.className = "task-subject";
        subject.textContent = task.subject;

        textContainer.appendChild(title);
        textContainer.appendChild(subject);

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(textContainer);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        listItem.appendChild(taskInfo);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });

    updateSummary();
}

// Add a new task.
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const subject = taskSubjectInput.value.trim();

    if (title === "") {
        formMessage.textContent = "Please enter a task title.";
        taskTitleInput.focus();
        return;
    }

    if (subject === "") {
        formMessage.textContent = "Please enter a subject or course name.";
        taskSubjectInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        subject: subject,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    displayTasks();

    taskForm.reset();
    formMessage.textContent = "";
    taskTitleInput.focus();
});

// Change a task between complete and incomplete.
function toggleTask(taskId) {
    tasks = tasks.map(function(task) {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Remove a task.
function deleteTask(taskId) {
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });

    saveTasks();
    displayTasks();
}

// Change the visible tasks when the filter changes.
taskFilter.addEventListener("change", displayTasks);

// Show saved tasks as soon as the page opens.
displayTasks();
