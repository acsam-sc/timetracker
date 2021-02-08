import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import shortid from 'shortid'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { readFile, writeFile, unlink } = require('fs').promises

const tasksFile = `${__dirname}/tasks.json`

const Root = () => ''

try {
  // eslint-disable-next-line no-console
  console.log(Root)
} catch (ex) {
  // eslint-disable-next-line no-console
  console.log('run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const writeTasksFile = async (data) => {
  await writeFile(tasksFile, JSON.stringify(data), { encoding: 'utf8' })
}

const deleteTasksFile = async () => {
  await unlink(tasksFile)
}

const readTasksFile = async () => {
  const fd = await readFile(tasksFile, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch((err) => {
      if (err.code === 'ENOENT') {
        return []
      }
      return err
    })
  // console.log('FD', fd)
  return fd
}

server.get('/api/v1/tasks', async (req, res) => {
  const { page = 1, count = 20 } = req.query
  const deleted = '_isDeleted'
  const data = await readTasksFile()

  const compareAZ = (a, b) => {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  }

  const compareZA = (a, b) => {
    if (a.title > b.title) return -1
    if (a.title < b.title) return 1
    return 0
  }

  const categoriesAZ = (a, b) => {
    if (a.category < b.category) return -1
    if (a.category > b.category) return 1
    return 0
  }

  const categoriesZA = (a, b) => {
    if (a.category > b.category) return -1
    if (a.category < b.category) return 1
    return 0
  }

  const sortAZ = () => {
    const titlesArray = data
      .map((it, index) => {
        return { index, title: it.title }
      })
      .sort(compareAZ)
    return titlesArray.map((it) => data[it.index])
  }

  const sortZA = () => {
    const titlesArray = data
      .map((it, index) => {
        return { index, title: it.title }
      })
      .sort(compareZA)
    return titlesArray.map((it) => data[it.index])
  }

  const sortByCategoriesAZ = () => {
    const categoriesArray = data
      .map((it, index) => {
        return { index, category: it.category }
      })
      .sort(categoriesAZ)
    return categoriesArray.map((it) => data[it.index])
  }

  const sortByCategoriesZA = () => {
    const categoriesArray = data
      .map((it, index) => {
        return { index, category: it.category }
      })
      .sort(categoriesZA)
    return categoriesArray.map((it) => data[it.index])
  }

  const sortByStartDateLowHigh = () => {
    const datesArray = data
      .map((it, index) => {
        return { index, startTime: it.startTime }
      })
      .sort((a, b) => a.startTime - b.startTime)
    return datesArray.map((it) => data[it.index])
  }

  const sortByStartDateHighLow = () => {
    const datesArray = data
      .map((it, index) => {
        return { index, startTime: it.startTime }
      })
      .sort((a, b) => b.startTime - a.startTime)
    return datesArray.map((it) => data[it.index])
  }

  const sortByFinishDateLowHigh = () => {
    const datesArray = data
      .map((it, index) => {
        return { index, startTime: it.startTime }
      })
      .sort((a, b) => a.startTime - b.startTime)
    return datesArray.map((it) => data[it.index])
  }

  const sortByFinishDateHighLow = () => {
    const datesArray = data
      .map((it, index) => {
        return { index, finishTime: it.finishTime }
      })
      .sort((a, b) => b.finishTime - a.finishTime)
    return datesArray.map((it) => data[it.index])
  }

  const sortedItems = () => {
    switch (req.query.sortby) {
      case 'a-z':
        return sortAZ()
      case 'z-a':
        return sortZA()
      case 'startDateAsc':
        return sortByStartDateLowHigh()
      case 'startDateDesc':
        return sortByStartDateHighLow()
      case 'categoriesA-Z':
        return sortByCategoriesAZ()
      case 'categoriesZ-A':
        return sortByCategoriesZA()
      case 'finishDateAsc':
        return sortByFinishDateLowHigh()
      case 'finishDateDesc':
        return sortByFinishDateHighLow()
      default:
        return data
    }
  }

  const portionToSend = sortedItems()
    .slice((page - 1) * count, page * count)
    .filter((it) => !it[deleted])
    .map((it) => {
      const filteredKeys = Object.keys(it).filter((key) => key[0] !== '_')
      return filteredKeys.reduce((acc, item) => {
        return { ...acc, [item]: it[item] }
      }, {})
    })
  res.json({ items: portionToSend, totalCount: data.length })
})

server.post('/api/v1/tasks', async (req, res) => {
  const newTask = {
    taskId: shortid.generate(),
    title: req.body.title,
    category: req.body.category,
    startTime: req.body.startTime,
    finishTime: req.body.finishTime,
    _isDeleted: false,
    _createdAt: +new Date(),
    _deletedAt: null
  }
  await readTasksFile()
    .then((it) => {
      writeTasksFile([...it, newTask])
      const responseBody = { status: 'success', taskId: newTask.taskId }
      res.json(responseBody)
    })
    .catch((err) => {
      if (err.code === 'ENOENT') {
        writeTasksFile([newTask])
        const responseBody = { status: 'success', taskId: newTask.taskId }
        res.json(responseBody)
      }
    })
})

server.patch('/api/v1/tasks/:taskId', async (req, res) => {
  const data = await readTasksFile()
  const dataToWrite = data.map((it) => {
    if (it.taskId === req.params.taskId) return { ...it, ...req.body }
    return it
  })
  writeTasksFile(dataToWrite)
  const responseBody = { status: 'success', taskId: req.params.taskId }
  res.json(responseBody)
})

server.delete('/api/v1/deleteall', async (req, res) => {
  deleteTasksFile()
  const responseBody = { status: 'success' }
  res.json(responseBody)
})

server.delete('/api/v1/tasks/:taskId', async (req, res) => {
  const data = await readTasksFile()
  const dataToWrite = data.map((it) => {
    if (it.taskId === req.params.taskId) return { ...it, _isDeleted: true, _deletedAt: +new Date() }
    return it
  })
  writeTasksFile(dataToWrite)
  const responseBody = { status: 'success', taskId: req.params.taskId }
  res.json(responseBody)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
