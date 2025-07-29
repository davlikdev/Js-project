const newTaskInputElement = document.querySelector("#new-task-input");
const taskListElement = document.querySelector(".task-list")
const doneTaskListElement = document.querySelector(".done-task-list")
const newTaskFormElement = document.querySelector("#new-task-form");
const taskListTitleElement = document.querySelector("#task-list-title");
const doneTaskListTitleElement = document.querySelector("#done-task-list-title");

let tasks = []
let doneTasks = []

const API_URL = "https://41e41b24fca9ffd8.mokky.dev/tasks"

getTasks()

function eventManager() {

}

newTaskFormElement.addEventListener("submit", handleAddTask)
taskListElement.addEventListener("click", (e) => {
    if (e.target.dataset.action === "done") {
        const taskId = e.target.dataset.id
        handleCompleteTask(taskId)
    }

    if (e.target.dataset.action === "delete") {
        const taskId = e.target.dataset.id
        handleDeleteTask(taskId)
    }
})

function handleAddTask(e) {
    e.preventDefault()
    const newItemText = newTaskInputElement.value;
    fetch(API_URL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: newItemText
        })
    }).then(getTasks).then(() => {
        newTaskInputElement.value = "";
        newTaskInputElement.focus()
    })
}

function createListItem(text, id, done) {

    let styles = "task-text"

    if (done) {
        styles += " done"
        const doneListItem = `<li class="task-list-item">
                <div class="${styles}">${text}</div>
              </li>`
        return doneListItem
    }
    if (!done) {
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

}

function handleCompleteTask(id) {
    {
        fetch(API_URL + "/" + id, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                isDone: true
            })
        }).then(getTasks)


    }
}

function handleDeleteTask(id) {
    fetch(API_URL + "/" + id, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    }).then((res) => {

        const filteredTasks = []
        for (const task of tasks) {
            if (task.id === id) {
                return null
            }
            filteredTasks.push(task)

        }
        tasks = filteredTasks
        renderTasks()

    })

}

function renderTasks(   ) {
    let tasksHTML = ""
    let doneTasksHTML = ""

    tasks.forEach(task => {
        tasksHTML += createListItem(task.text, task.id, false)
        taskListElement.innerHTML = tasksHTML
    })
    doneTasks.forEach(task => {
        doneTasksHTML += createListItem(task.text, task.id, task.isDone)
        doneTaskListElement.innerHTML = doneTasksHTML
    })

    taskListTitleElement.textContent = `Tasks to do - ${tasks.length}`
    doneTaskListTitleElement.textContent = `Done tasks - ${doneTasks.length}`
}

function getTasks() {


    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            tasks = data.filter(task => !task.isDone)
            doneTasks = data.filter(task => task.isDone)
            renderTasks()


            // console.log(tasks)
            // console.log(doneTasks)
        })
}