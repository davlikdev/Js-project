import {taskModel} from "./model.js";

const newTaskInputElement = document.querySelector("#new-task-input");
const taskListElement = document.querySelector(".task-list")
const doneTaskListElement = document.querySelector(".done-task-list")
const newTaskFormElement = document.querySelector("#new-task-form");
const taskListTitleElement = document.querySelector("#task-list-title");
const doneTaskListTitleElement = document.querySelector("#done-task-list-title");

await appInit()


function eventManager() {

}

newTaskFormElement.addEventListener("submit", handleAddTask)
document.addEventListener("click", (e) => {
    if (e.target.dataset.action === "done") {
        const taskId = Number(e.target.dataset.id)
        const isDone = taskModel.getTaskById(taskId).isDone

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
    await taskModel.addTask(newItemText)
    renderTasks()
    newTaskInputElement.value = "";
    newTaskInputElement.focus()
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
    await taskModel.completeTask(id, isDone)
    renderTasks()
}

async function handleDeleteTask(id) {
    await taskModel.deleteTask(id)
    renderTasks()

}

async function appInit (){
    await taskModel.getTasksFromServer()
    renderTasks()
}

function renderTasks() {
    taskListElement.innerHTML = ""
    doneTaskListElement.innerHTML = ""
    const tasks = taskModel.getTasks()
    const notDoneTasks = taskModel.getNotDoneTasks()
    const doneTask =  taskModel.getDoneTasks()

    for (const task of tasks) {
        if (!task.isDone) {
            taskListElement.innerHTML += createListItem(task.text, task.id, false)
        } else {
            doneTaskListElement.innerHTML += createListItem(task.text, task.id, task.isDone)
        }
    }
    taskListTitleElement.textContent = `Tasks to do - 
    ${notDoneTasks.length}`
    doneTaskListTitleElement.textContent = `Done tasks - 
    ${doneTask.length}`
}
