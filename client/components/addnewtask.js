import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNewTaskTitle,
  setCategory,
  setNewTaskStartDate,
  setNewTaskStartTime,
  setNewTaskFinishDate,
  setNewTaskFinishTime,
  sendNewTask
} from '../redux/reducers/newtask'

const AddNewTask = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const {
    category,
    newTaskStartDate,
    newTaskStartTime,
    newTaskFinishDate,
    newTaskFinishTime
  } = useSelector((state) => state.newtask)

  const handleSaveButtonPress = (e) => {
    dispatch(setNewTaskTitle(inputValue))
    dispatch(sendNewTask())
    e.preventDefault()
  }

  return (
    <div className="flex flex-row py-2 w-full bg-blue-200 md:text-base text-sm justify-between items-center">
      <input
        className="flex w-1/2 ml-2"
        placeholder="Enter new task name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="flex flex-col items-center px-2">
        <div>Category:</div>
        <div>
          <select value={category} onChange={(e) => dispatch(setCategory(e.target.value))}>
            <option value="coding">Coding</option>
            <option value="programming">Programming</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>
      </div>
      <div className="px-2">
        <div className="flex flex-col items-center">
          <div>Start at:</div>
          <div>
            <input
              type="date"
              onChange={(e) => dispatch(setNewTaskStartDate(e.target.value))}
              value={newTaskStartDate}
            />
          </div>
          <div>
            <input
              type="time"
              onChange={(e) => dispatch(setNewTaskStartTime(e.target.value))}
              value={newTaskStartTime}
            />
          </div>
        </div>
      </div>
      <div className="px-2">
        <div className="flex flex-col items-center">
          <div>Finish at:</div>
          <div>
            <input
              type="date"
              onChange={(e) => dispatch(setNewTaskFinishDate(e.target.value))}
              value={newTaskFinishDate}
            />
          </div>
          <div>
            <input
              type="time"
              onChange={(e) => dispatch(setNewTaskFinishTime(e.target.value))}
              value={newTaskFinishTime}
            />
          </div>
        </div>
      </div>
      <button
        className="flex m-1 mr-2 px-1 bg-gray-400"
        type="button"
        onClick={handleSaveButtonPress}
      >
        Save
      </button>
    </div>
  )
}

export default React.memo(AddNewTask)
