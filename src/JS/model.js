import {httpClient} from "./httpClient.js";
import {taskRepository} from "./taskRepository.js";

class TaskModel {
    constructor(initialState = []) {
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
            const data = {
                isDone: !isDone
            }
            await taskRepository.patchTask(id, data)
            const task = this.state.find(task => task.id === id)
            task.isDone = !task.isDone
        } catch (error) {
            console.log(error)
        }
    }

    async addTask(text) {
        try {
            const data = {
                text,
                isDone: false,
            }
            const newTask = taskRepository.postTask(data)
            this.state.push(newTask)

        } catch (error) {
            console.log(error)
        }
    }

    async deleteTask(id) {
        try {
            await taskRepository.deleteTask(id)
            this.state = this.state.filter(task => task.id !== id)

        } catch (error) {
            console.log(error)
        }
    }

    async getTasksFromServer() {
        try {
            this.state = await taskRepository.getTasks()

        } catch (error) {
            console.log(error)
        }
    }
}

export const taskModel = new TaskModel()