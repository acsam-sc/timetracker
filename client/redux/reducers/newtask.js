import { postNewTask } from '../../api/api'
import { getTasks } from './tasks'

const initialState = {
  newTaskTitle: '',
  category: 'coding',
  newTaskStartDate: '2020-01-01',
  newTaskFinishDate: '2020-01-01',
  newTaskStartTime: '00:00',
  newTaskFinishTime: '00:00',
  error: { type: null, text: null }
}

const SET_NEW_TASK_TITLE = 'newtask/SET_NEW_TASK_TITLE'
const SET_CATEGORY = 'newtask/SET_CATEGORY'
const SET_NEW_TASK_START_DATE = 'newtask/SET_NEW_TASK_START_DATE'
const SET_NEW_TASK_START_TIME = 'newtask/SET_NEW_TASK_START_TIME'
const SET_NEW_TASK_FINISH_DATE = 'newtask/SET_NEW_TASK_FINISH_DATE'
const SET_NEW_TASK_FINISH_TIME = 'newtask/SET_NEW_TASK_FINISH_TIME'
const SET_ERROR = 'newtask/SET_ERROR'

export const setNewTaskTitle = (newTaskTitle) => ({
  type: SET_NEW_TASK_TITLE,
  payload: newTaskTitle
})
export const setCategory = (category) => ({ type: SET_CATEGORY, payload: category })
export const setNewTaskStartDate = (newTaskStartDate) => ({
  type: SET_NEW_TASK_START_DATE,
  payload: newTaskStartDate
})
export const setNewTaskStartTime = (newTaskStartTime) => ({
  type: SET_NEW_TASK_START_TIME,
  payload: newTaskStartTime
})
export const setNewTaskFinishDate = (newTaskFinishDate) => ({
  type: SET_NEW_TASK_FINISH_DATE,
  payload: newTaskFinishDate
})
export const setNewTaskFinishTime = (newTaskFinishTime) => ({
  type: SET_NEW_TASK_FINISH_TIME,
  payload: newTaskFinishTime
})
const setError = (error) => ({ type: SET_ERROR, payload: error })

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_TASK_TITLE:
      return { ...state, newTaskTitle: action.payload }
    case SET_CATEGORY:
      return { ...state, category: action.payload }
    case SET_NEW_TASK_START_DATE:
      return { ...state, newTaskStartDate: action.payload }
    case SET_NEW_TASK_START_TIME:
      return { ...state, newTaskStartTime: action.payload }
    case SET_NEW_TASK_FINISH_DATE:
      return { ...state, newTaskFinishDate: action.payload }
    case SET_NEW_TASK_FINISH_TIME:
      return { ...state, newTaskFinishTime: action.payload }
    case SET_ERROR:
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export const sendNewTask = () => async (dispatch, getState) => {
  const {
    newTaskTitle,
    category,
    newTaskStartDate,
    newTaskStartTime,
    newTaskFinishDate,
    newTaskFinishTime
  } = getState().newtask
  const startTime = +new Date(`${newTaskStartDate} ${newTaskStartTime}`)
  const finishTime = +new Date(`${newTaskFinishDate} ${newTaskFinishTime}`)
  if (newTaskTitle !== '') {
    try {
      const response = await postNewTask(newTaskTitle, category, startTime, finishTime)
      if (response.data.status === 'success') {
        dispatch(getTasks())
      }
    } catch (err) {
      dispatch(setError({ type: 'sending', text: 'Error sending task, please try again' }))
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }
}

