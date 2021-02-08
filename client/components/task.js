import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateTask, delTask } from '../redux/reducers/tasks'

const Task = (props) => {
  const dispatch = useDispatch()
  const [isEditMode, setIsEditMode] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)
  const [category, setCategory] = useState(props.category)
  const [taskStartDate, setTaskStartDate] = useState(new Date(props.startTime).toISOString().slice(0, 10))
  const [taskStartTime, setTaskStartTime] = useState(new Date(props.startTime).toISOString().slice(11, 16))
  const [taskFinishDate, setTaskFinishDate] = useState(new Date(props.finishTime).toISOString().slice(0, 10))
  const [taskFinishTime, setTaskFinishTime] = useState(new Date(props.finishTime).toISOString().slice(11, 16))
  const startTime = +new Date(`${taskStartDate} ${taskStartTime}`)
  const finishTime = +new Date(`${taskFinishDate} ${taskFinishTime}`)

  const handleButtonPress = () => {
    if (isEditMode) {
      setIsEditMode(false)
      dispatch(updateTask(props.taskId, inputValue, category, startTime, finishTime))
    }
    else setIsEditMode(true)
  }
  const handleDelPress = () => {
      dispatch(delTask(props.taskId))
  }

  return (
    <div className="flex w-full border-2 border-gray">
      {isEditMode ? 
      <input
        className="flex w-5/12 justify-center border-2 border-black"
        type="input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
        : <div className="flex w-5/12 justify-center">
        {props.title}
      </div>}
      {isEditMode ? 
        <select className="flex w-1/6" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Coding">Coding</option>
          <option value="Programming">Programming</option>
          <option value="Meeting">Meeting</option>
        </select>
      : <div className="flex w-1/6 justify-center">
       {props.category}
      </div>}
      {isEditMode ? 
        <>
          <input
            type="date"
            onChange={(e) => setTaskStartDate(e.target.value)}
            value={taskStartDate}
          />
          <input
            type="time"
            onChange={(e) => setTaskStartTime(e.target.value)}
            value={taskStartTime}
          />
        </>
      : <div className="flex w-1/6 justify-center">
        <span>{new Date(props.startTime).toISOString().slice(0, 10)} {new Date(props.startTime).toISOString().slice(11, 16)}</span>
      </div>}
      {isEditMode ? 
        <>
          <input
            type="date"
            onChange={(e) => setTaskFinishDate(e.target.value)}
            value={taskFinishDate}
          />
          <input
            type="time"
            onChange={(e) => setTaskFinishTime(e.target.value)}
            value={taskFinishTime}
          />
        </>
      : <div className="flex w-1/6 justify-center">
        <span>{new Date(props.finishTime).toISOString().slice(0, 10)} {new Date(props.finishTime).toISOString().slice(11, 16)}</span>
      </div>}
      <div className="flex w-1/12">
        <button
          className="flex m-1 mr-2 px-1 bg-gray-400"
          type="button"
          onClick={handleButtonPress}
        >
          {isEditMode ? 'Save' : 'Edit'}
        </button>
        <button
          className="flex m-1 mr-2 px-1 bg-gray-400"
          type="button"
          onClick={handleDelPress}
        >
          Del
        </button>
      </div>
    </div>
  )
}

export default Task
