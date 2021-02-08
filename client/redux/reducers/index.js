import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import tasksReducer from './tasks'
import newTaskReducer from './newtask'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    tasks: tasksReducer,
    newtask: newTaskReducer
  })

export default createRootReducer
