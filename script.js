javascript
// LOAD TASKS FROM LOCAL STORAGE
let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("tasks") || "[]"
    );

    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    tasks = [];
}

displayTasks();
updateDashboard();


// ADD TASK
function addTask() {
    const taskNameInput = document.getElementById("taskName");
    const taskDateInput = document.getElementById("taskDate");
    const priorityInput = document.getElementById("taskPriority");

    const taskName = taskNameInput.value.trim();
    const taskDate = taskDateInput.value;
    const priority = priorityInput.value;

    if (!taskName || !taskDate) {
        alert("Please enter task name and deadline.");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        date: taskDate,
        priority: priority,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskNameInput.value = "";
    taskDateInput.value = "";

    refreshApp();
}


// DISPLAY TASKS
function displayTasks(list = tasks) {
    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    if (list.length === 0) {
        const message = document.createElement("p");
        message.className = "no-task";
        message.textContent = "No tasks found.";

        taskList.appendChild(message);
        return;
    }

    list.forEach(function(task) {
        const div = document.createElement("div");
        div.className = "task";

        if (task.completed) {
            div.classList.add("completed");
        }

        // Task information
        const info = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = task.name;

        const date = document.createElement("p");
        date.textContent = "Deadline: " + formatDate(task.date);

        const deadline = getDeadlineStatus(task);
        const deadlineLabel = document.createElement("span");

        deadlineLabel.className =
            "deadline " + deadline.className;

        deadlineLabel.textContent = deadline.text;

        info.appendChild(heading);
        info.appendChild(date);
        info.appendChild(deadlineLabel);

        // Task actions
        const actions = document.createElement("div");

        const priorityLabel = document.createElement("span");

        priorityLabel.className = task.completed
            ? "low"
            : task.priority.toLowerCase();

        priorityLabel.textContent = task.completed
            ? "Completed"
            : task.priority;

        const completeButton = document.createElement("button");

        completeButton.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeButton.addEventListener("click", function() {
            completeTask(task.id);
        });

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        actions.appendChild(priorityLabel);
        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        div.appendChild(info);
        div.appendChild(actions);

        taskList.appendChild(div);
    });
}


// CHECK DEADLINE STATUS
function getDeadlineStatus(task) {
    if (task.completed) {
        return {
            text: "Completed",
            className: "deadline-completed"
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(task.date + "T00:00:00");
    deadline.setHours(0, 0, 0, 0);

    const difference = Math.round(
        (deadline - today) / (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
        return {
            text: "OVERDUE",
            className: "deadline-overdue"
        };
    }

    if (difference === 0) {
        return {
            text: "DUE TODAY",
            className: "deadline-today"
        };
    }

    if (difference === 1) {
        return {
            text: "Due Tomorrow",
            className: "deadline-tomorrow"
        };
    }

    return {
        text: "Upcoming",
        className: "deadline-upcoming"
    };
}


// FORMAT DATE
function formatDate(date) {
    const parts = date.split("-");

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


// COMPLETE / UNDO TASK
function completeTask(id) {
    tasks.forEach(function(task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }
    });

    saveTasks();
    refreshApp();
}


// DELETE TASK
function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    refreshApp();
}


// SEARCH AND FILTER TASKS
function filterTasks() {
    const searchText = document
        .getElementById("searchTask")
        .value.toLowerCase().trim();

    const filter = document
        .getElementById("filterPriority")
        .value;

    const filteredTasks = tasks.filter(function(task) {
        const matchesSearch = task.name
            .toLowerCase()
            .includes(searchText);

        let matchesFilter = true;

        switch (filter) {
            case "Pending":
                matchesFilter = !task.completed;
                break;

            case "Completed":
                matchesFilter = task.completed;
                break;

            case "High":
            case "Medium":
            case "Low":
                matchesFilter =
                    task.priority === filter && !task.completed;
                break;
        }

        return matchesSearch && matchesFilter;
    });

    displayTasks(filteredTasks);
}


// REFRESH TASKS AND DASHBOARD
function refreshApp() {
    filterTasks();
    updateDashboard();
}


// UPDATE DASHBOARD
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent =
        completed;

    document.getElementById("pendingTasks").textContent =
        pending;

    document.getElementById("progress").textContent =
        progress + "%";

    const ring = document.getElementById("progressRing");

if (ring) {
    ring.style.setProperty("--progress", progress + "%");

    ring.setAttribute(
        "aria-label",
        progress + "% tasks completed"
    );
}
}