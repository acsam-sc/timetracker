import axios from 'axios'

const apiUrl = `${window.location.origin}/api/v1`

export const postNewTask = async (title, category, startTime, finishTime) => {
  return axios.post(`${apiUrl}/tasks`, { title, category, startTime, finishTime })
}

export const reqTasks = async (sortby, page, count) => {
  return axios.get(`${apiUrl}/tasks?sortby=${sortby}&page=${page}&count=${count}`)
}

export const patchTask = async (taskId, title, category, startTime, finishTime) => {
  return axios.patch(`${apiUrl}/tasks/${taskId}`, { title, category, startTime, finishTime })
}

export const deleteTask = async (taskId) => {
  return axios.delete(`${apiUrl}/tasks/${taskId}`)
}
