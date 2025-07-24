const newTaskInputElement = document.querySelector("#new-task-input");
const taskListElement = document.querySelector(".task-list")
const newTaskFormElement = document.querySelector("#new-task-form");

newTaskFormElement.addEventListener("submit", handleAddTask)
taskListElement.addEventListener("click", (e) => {
    if (e.target.dataset.action === "done") {
        handleCompleteTask(e)
    }

    if (e.target.dataset.action === "delete") {
        handleDeleteTask(e)
    }
})

function handleAddTask(e) {

    e.preventDefault()
    const newItemText = newTaskInputElement.value;
    const newItem = createListItem(newItemText)
    taskListElement.insertAdjacentHTML("beforeend", newItem)
    newTaskInputElement.value = "";
    newTaskInputElement.focus()
}

function createListItem(text) {
    const listItem = `
                        <li class="task-list-item">
                        <div class="task-text">${text}</div>
                        <div class="task-actions">
                            <button data-action="done" class="done-task-button task-button">
                                <img src="../../public/images/done.png" height="13" width="18" alt="done task button">
                            </button>
                            <button data-action="delete" class="delete-task-button task-button">
                                <img src="../../public/images/delete.png" height="19" width="18" alt="delete task button">
                            </button>
                        </div>
                    </li>
                  
    `
    return listItem
}

function handleCompleteTask(e) {
    {
        const currentTask = e.target.closest(".task-list-item");
        const taskText = currentTask.querySelector(".task-text");
        taskText.classList.add("done-task-text")
    }
}

function handleDeleteTask(e) {
    e.target.closest(".task-list-item").remove();
}