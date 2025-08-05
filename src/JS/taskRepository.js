import {httpClient} from "./httpClient.js";

class TaskRepository {
    endPoint = "tasks"

    async getTasks() {
        return await httpClient.get(this.endPoint)
    }

    async deleteTask(id) {
         await httpClient.delete(this.endPoint, id)
    }

    async postTask(data) {
        return await httpClient.post(this.endPoint, data)
    }

    async patchTask(id, data) {
        await httpClient.patch(this.endPoint, data, id)
    }
}

export const taskRepository = new TaskRepository()