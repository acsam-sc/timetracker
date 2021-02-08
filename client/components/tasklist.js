import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Task from './task'
import { getTasks } from '../redux/reducers/tasks'

const TaskList = () => {
  const dispatch = useDispatch()
  const { tasksArray } = useSelector((state) => state.tasks)

  useEffect(() => {
    dispatch(getTasks())
  }, [])

  return (
    <div className="flex flex-col w-full">
      {tasksArray.length > 0 && tasksArray.map((it) => (
      <Task
        key={it.taskId}
        taskId={it.taskId}
        title={it.title}
        category={it.category}
        startTime={it.startTime}
        finishTime={it.finishTime}  
      />
      ))}
    </div>
  )
}

export default TaskList
