import {httpClient} from "./httpClient.js"

const newTaskInputElement = document.querySelector("#new-task-input");
const taskListElement = document.querySelector(".task-list")
const doneTaskListElement = document.querySelector(".done-task-list")
const newTaskFormElement = document.querySelector("#new-task-form");
const taskListTitleElement = document.querySelector("#task-list-title");
const doneTaskListTitleElement = document.querySelector("#done-task-list-title");

let tasks = []

const API_URL = "https://41e41b24fca9ffd8.mokky.dev/tasks"

await getTasks()

function eventManager() {

}

newTaskFormElement.addEventListener("submit", handleAddTask)
document.addEventListener("click", (e) => {
    if (e.target.dataset.action === "done") {
        const taskId = Number(e.target.dataset.id)
        const isDone = tasks.find(task => task.id === taskId).isDone

        handleCompleteTask(taskId, isDone)
    }

    if (e.target.dataset.action === "delete") {
        const taskId = Number(e.target.dataset.id)
        handleDeleteTask(taskId)
    }
})

async function handleAddTask(e) {
    e.preventDefault()
    const newItemText = newTaskInputElement.value;
    try {
        const newTask = await httpClient.post("tasks", {
            text: newItemText,
            isDone: false,
        })

        tasks.push(newTask)
        renderTasks()
        newTaskInputElement.value = "";
        newTaskInputElement.focus()

    } catch (error) {
        console.log(error)
    }

}

function createListItem(text, id, isDone) {

    let styles = isDone ? "task-text done" : "task-text"

    const listItem = `
                        <li class="task-list-item">
                        <div class="${styles}">${text}</div>
                        <div class="task-actions">
                            <button data-action="done" data-id="${id}" class="done-task-button task-button">
                                <img src="../../public/images/done.png" height="13" width="18" alt="done task button">
                            </button>
                            <button data-action="delete" data-id="${id}" class="delete-task-button task-button">
                                <img src="../../public/images/delete.png" height="19" width="18" alt="delete task button">
                            </button>
                        </div>
                    </li>
    `
    return listItem

}

async function handleCompleteTask(id, isDone) {
    try {
        await httpClient.patch("tasks", {
            isDone: !isDone
        }, id)
        const task = tasks.find(task => task.id === id)
        task.isDone = !task.isDone
        renderTasks()
    } catch (error) {
        console.log(error)
    }

}

async function handleDeleteTask(id) {
    try {
        await httpClient.delete("tasks", id)
        tasks = tasks.filter(task => task.id !== id)
        renderTasks()

    } catch (error) {
        console.log(error)
    }
}

function renderTasks() {
    taskListElement.innerHTML = ""
    doneTaskListElement.innerHTML = ""

    for (const task of tasks) {
        if (!task.isDone) {
            taskListElement.innerHTML += createListItem(task.text, task.id, false)
        } else {
            doneTaskListElement.innerHTML += createListItem(task.text, task.id, task.isDone)
        }
    }
    taskListTitleElement.textContent = `Tasks to do - 
    ${tasks.filter(task => !task.isDone).length}`
    doneTaskListTitleElement.textContent = `Done tasks - 
    ${tasks.filter(task => task.isDone).length}`
}

async function getTasks() {
    try {
        tasks = await httpClient.get("tasks")
        renderTasks()

    } catch (error) {
        console.log(error)
    }
}