let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

displayTasks();
updateDashboard();


// ADD TASK
function addTask() {

    let taskName = document.getElementById("taskName").value;
    let taskDate = document.getElementById("taskDate").value;
    let priority = document.getElementById("taskPriority").value;

    if (taskName === "" || taskDate === "") {
        alert("Please enter task name and deadline");
        return;
    }

    let task = {
        id: Date.now(),
        name: taskName,
        date: taskDate,
        priority: priority,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    document.getElementById("taskName").value = "";
    document.getElementById("taskDate").value = "";

    displayTasks();
    updateDashboard();
}


// DISPLAY TASKS
function displayTasks(list = tasks) {

    let taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    if (list.length === 0) {

        taskList.innerHTML = `
            <p class="no-task">No tasks found.</p>
        `;

        return;
    }

    list.forEach(function(task) {

        let div = document.createElement("div");

        div.className = "task";

        if (task.completed) {
            div.classList.add("completed");
        }

        let deadlineStatus = getDeadlineStatus(task);

        div.innerHTML = `
            <div>
                <h3>${task.name}</h3>

                <p>
                    Deadline: ${formatDate(task.date)}
                </p>

                <span class="deadline ${deadlineStatus.className}">
                    ${deadlineStatus.text}
                </span>
            </div>

            <div>

                <span class="${
                    task.completed
                    ? "low"
                    : task.priority.toLowerCase()
                }">
                    ${task.completed ? "Completed" : task.priority}
                </span>

                <button onclick="completeTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(div);
    });
}


// CHECK DEADLINE
function getDeadlineStatus(task) {

    if (task.completed) {

        return {
            text: "Completed",
            className: "deadline-completed"
        };
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let deadline = new Date(task.date + "T00:00:00");
    deadline.setHours(0, 0, 0, 0);

    let difference =
        Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (difference < 0) {

        return {
            text: "OVERDUE",
            className: "deadline-overdue"
        };

    } else if (difference === 0) {

        return {
            text: "DUE TODAY",
            className: "deadline-today"
        };

    } else if (difference === 1) {

        return {
            text: "Due Tomorrow",
            className: "deadline-tomorrow"
        };

    } else {

        return {
            text: "Upcoming",
            className: "deadline-upcoming"
        };
    }
}


// FORMAT DATE
function formatDate(date) {

    let parts = date.split("-");

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


// COMPLETE / UNDO
function completeTask(id) {

    tasks.forEach(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

    });

    saveTasks();

    displayTasks();
    updateDashboard();
}


// DELETE
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();

    displayTasks();
    updateDashboard();
}


// SEARCH + FILTER
function filterTasks() {

    let searchText =
        document.getElementById("searchTask").value.toLowerCase();

    let filter =
        document.getElementById("filterPriority").value;

    let filteredTasks = tasks.filter(function(task) {

        let matchesSearch =
            task.name.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (filter === "Pending") {
            matchesFilter = !task.completed;
        }

        else if (filter === "Completed") {
            matchesFilter = task.completed;
        }

        else if (filter === "High") {
            matchesFilter =
                task.priority === "High" && !task.completed;
        }

        else if (filter === "Medium") {
            matchesFilter =
                task.priority === "Medium" && !task.completed;
        }

        else if (filter === "Low") {
            matchesFilter =
                task.priority === "Low" && !task.completed;
        }

        return matchesSearch && matchesFilter;
    });

    displayTasks(filteredTasks);
}


// DASHBOARD
function updateDashboard() {

    let total = tasks.length;

    let completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let pending = total - completed;

    let progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;
    document.getElementById("progress").innerText = progress + "%";
}


// SAVE TASKS
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}