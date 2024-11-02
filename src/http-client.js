import axios from 'axios';

const USER_ID = 367;

const httpClient = axios.create({
    baseURL: 'https://mate.academy/students-api/todos'
});

export const getTasks = () => {
    return httpClient.get(`/?userId=${USER_ID}`).then(response => {
        return response.data;
    })
}

export const createTask = (title) => {
    return httpClient.post('', {
        title,
        completed: false,
        userId: USER_ID
    }).then(response => response.data)
}

export const deleteTask = (taskId) => {
    return httpClient.delete(`/${taskId}`)
}

export const patchTask = ({ id, title, completed }) => {
    return httpClient.patch(`/${id}`, {
        title,
        completed
    })
}

export const clearCompletedTasks = () => {
    return getTasks().then(tasks => {
        // Filtrujemy zakończone zadania
        const completedTasks = tasks.filter(task => task.completed);
        
        // Usuwamy każde zakończone zadanie
        const deletePromises = completedTasks.map(task => deleteTask(task.id));
        
        // Zwracamy Promise, który rozwiązuje się po usunięciu wszystkich zakończonych zadań
        return Promise.all(deletePromises);
    });
}
