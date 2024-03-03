const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const format = require('date-fns/format')
const isMatch = require('date-fns/isMatch')
const isValid = require('date-fns/isValid')
const datapath = path.join(__dirname, 'todoApplication.db')
app.use(express.json())
let db = null
const initialization = async () => {
  try {
    db = await open({
      filename: datapath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('success')
    })
  } catch (e) {
    console.log(`${e.message}`)
    process.exit(1)
  }
}
initialization()
const y = dataobject => {
  return {
    id: dataobject.id,
    todo: dataobject.todo,
    priority: dataobject.priority,
    status: dataobject.status,
    category: dataobject.category,
    dueDate: dataobject.due_date,
  }
}
const hasStatusAndPriority = balu =>
  balu.status !== undefined && balu.priority !== undefined

const hasStatus = balu => {
  return balu.status !== undefined
}
const hasPriority = balu => {
  return balu.priority !== undefined
}
const hasCategoryAndStatus = balu => {
  return balu.category !== undefined && balu.status !== undefined
}
const hasSearch = balu => {
  return balu.searh_q !== undefined
}
const hasCategory = balu => balu.category !== undefined
const hasCategoryAndPriority = balu => {
  return balu.category !== undefined && balu.priority !== undefined
}
app.get('/todos/', async (request, response) => {
  let database = null
  let c = ''
  const {search_q = '', status, priority, category} = request.query
  switch (true) {
    case hasStatusAndPriority(request.query):
      if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
        if (
          priority === 'HIGH' ||
          priority === 'MEDIUM' ||
          priority === 'LOW'
        ) {
          c = `SELECT *
                             FROM todo
                             WHERE status="${status}" AND priority="${priority}";`
          database = await db.all(c)

          response.send(database.map(eachTodo => y(eachTodo)))
        } else {
          response.status(400)
          response.send('Invalid Todo Priority')
        }
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break
    case hasStatus(request.query):
      if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
        c = `SELECT *
                         FROM todo
                         WHERE status="${status}";`
        database = await db.all(c)
        response.send(database.map(eachTodo => y(eachTodo)))
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break
    case hasPriority(request.query):
      if (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') {
        const y = `SELECT *
                         FROM todo
                         WHERE priority="${priority}";`
        database = await db.all(y)
        response.send(database.map(eachTodo => y(eachTodo)))
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break
    case hasSearch(request.query):
      const v = `SELECT *
                FROM todo
                WHERE todo LIKE "%${search_q}%";`
      database = await db.all(v)
      console.log(database)
      response.send(database.map(eachTodo => y(eachTodo)))
      break
    case hasCategoryAndStatus(request.query):
      if (
        category === 'WORK' ||
        category === 'HOME' ||
        category === 'LEARNING'
      ) {
        if (
          status === 'TO DO' ||
          status === 'IN PROGRESS' ||
          status === 'DONE'
        ) {
          const v = `SELECT *
                             FROM todo
                             WHERE category="${category}" AND status="${status}";`
          database = await db.all(v)
          response.send(database.map(eachTodo => y(eachTodo)))
        } else {
          response.status(400)
          response.send('Invalid Todo Status')
        }
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break
  }
})
