import { reqTasks, patchTask, deleteTask } from '../../api/api'

const initialState = {
  tasksArray: [],
  totalCount: 0,
  sortby: 'a-z',
  page: 1,
  count: 20,
  isFetching: false,
  error: { type: null, text: null }
}

const SET_TASKS_ARRAY = 'newtask/SET_TASKS_ARRAY'
const SET_TOTAL_COUNT = 'newtask/SET_TOTAL_COUNT'
const SET_IS_FETCHING = 'newtask/SET_IS_FETCHING'
const SET_ERROR = 'newtask/SET_ERROR'
const SET_SORT_BY = 'newtask/SET_SORT_BY'

export const setTasksArray = (tasksArray) => ({ type: SET_TASKS_ARRAY, payload: tasksArray })
const setTotalCount = (totalCount) => ({ type: SET_TOTAL_COUNT, payload: totalCount })
const setIsFetching = (isFetching) => ({ type: SET_IS_FETCHING, payload: isFetching })
const setError = (error) => ({ type: SET_ERROR, payload: error })
export const setSortBy = (sortby) => ({ type: SET_SORT_BY, payload: sortby })

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TASKS_ARRAY:
      return { ...state, tasksArray: action.payload }
    case SET_TOTAL_COUNT:
      return { ...state, totalCount: action.payload }
    case SET_IS_FETCHING:
      return { ...state, isFetching: action.payload }
    case SET_ERROR:
      return { ...state, error: action.payload }
    case SET_SORT_BY:
      return { ...state, sortby: action.payload }
    default:
      return state
  }
}

export const getTasks = () => async (dispatch, getState) => {
  const { sortby, page, count } = getState().tasks
  dispatch(setIsFetching(true))
  try {
    const response = await reqTasks(sortby, page, count)
    dispatch(setIsFetching(false))
    dispatch(setTasksArray(response.data.items))
    dispatch(setTotalCount(response.data.totalCount))
  } catch (err) {
    dispatch(setIsFetching(false))
    dispatch(
      setError({ type: 'connection', text: 'Cannot connect to the server, please reload page' })
    )
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

export const updateTask = (taskId, title, category, startTime, finishTime) => async (dispatch) => {
  try {
    const response = await patchTask(taskId, title, category, startTime, finishTime)
    if (response.data.status === 'success') {
      dispatch(getTasks())
    }
  } catch (err) {
    dispatch(setError({ type: 'sending', text: 'Error sending task, please try again' }))
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

export const delTask = (taskId) => async (dispatch) => {
  try {
    const response = await deleteTask(taskId)
    if (response.data.status === 'success') {
      dispatch(getTasks())
    }
  } catch (err) {
    dispatch(setError({ type: 'sending', text: 'Error sending task, please try again' }))
    // eslint-disable-next-line no-console
    console.log(err)
  }
}