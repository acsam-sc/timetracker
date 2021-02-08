import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddNewTask from './addnewtask'
import TaskList from './tasklist'
import { setSortBy, getTasks } from '../redux/reducers/tasks'

const App = () => {
  const { sortby } = useSelector((state) => state.tasks)
  const dispatch = useDispatch()
  const handleTaskTitleClick = () => {
    if (sortby === 'a-z') dispatch(setSortBy('z-a'))
    else dispatch(setSortBy('a-z'))
    dispatch(getTasks())
  }
  const handleCategoryClick = () => {
    if (sortby === 'categoriesA-Z') dispatch(setSortBy('categoriesZ-A'))
    else dispatch(setSortBy('categoriesA-Z'))
    dispatch(getTasks())
  }
  const handleStartAtClick = () => {
    if (sortby === 'startDateDesc') dispatch(setSortBy('startDateAsc'))
    else dispatch(setSortBy('startDateDesc'))
    dispatch(getTasks())
  }
  const handleFinishAtClick = () => {
    if (sortby === 'finishDateDesc') dispatch(setSortBy('finishDateAsc'))
    else dispatch(setSortBy('finishDateDesc'))
    dispatch(getTasks())
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center">
      <div className="w-full">
        <div>
          <AddNewTask />
        </div>
        <div className="flex w-full font-bold">
          <div className="flex w-5/12 justify-center">
            <span
              onClick={handleTaskTitleClick}
              role="button"
              tabIndex="0"
              onKeyDown={handleTaskTitleClick}
            >Task Title</span>
          </div>
          <div className="flex w-1/6 justify-center">
            <span
              onClick={handleCategoryClick}
              role="button"
              tabIndex="0"
              onKeyDown={handleCategoryClick}
            >Category</span>
          </div>
          <div className="flex w-1/6 justify-center">
            <span
              onClick={handleStartAtClick}
              role="button"
              tabIndex="0"
              onKeyDown={handleStartAtClick}
            >Start at:</span>
          </div>
          <div className="flex w-1/6 justify-center">
            <span
              onClick={handleFinishAtClick}
              role="button"
              tabIndex="0"
              onKeyDown={handleFinishAtClick}
            >Finish at:</span>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <TaskList />
        </div>
      </div>
    </div>
  )
}

export default App
