import {httpClient} from "./httpClient.js";

class TaskModel {
    constructor(initialState=[]) {
        this.state = initialState
    }

    getTaskById(taskId) {
        return taskModel.state.find(task => task.id === taskId)
    }

    getNotDoneTasks() {
        return this.state.filter(task => !task.isDone)
    }

    getDoneTasks() {
        return this.state.filter(task => task.isDone)
    }

    getTasks() {
        return this.state
    }

    async completeTask(id, isDone) {
        try {
            await httpClient.patch("tasks", {
                isDone: !isDone
            }, id)
            const task = this.state.find(task => task.id === id)
            task.isDone = !task.isDone
        } catch (error) {
            console.log(error)
        }
    }

    async addTask(text) {
        try {
            const newTask = await httpClient.post("tasks", {
                text,
                isDone: false,
            })
            this.state.push(newTask)

        } catch (error) {
            console.log(error)
        }
    }

    async deleteTask(id) {
        try {
            await httpClient.delete("tasks", id)
            this.state = this.state.filter(task => task.id !== id)

        } catch (error) {
            console.log(error)
        }
    }

    async getTasksFromServer() {
        try {
            this.state = await httpClient.get("tasks")

        } catch (error) {
            console.log(error)
        }
    }
}
export const taskModel = new TaskModel()