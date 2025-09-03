import experss from 'express'
import cors from 'cors'
import pkg from 'pg'

const port = 3001
const { Pool } = pkg

const app = experss()

app.use(cors())
app.use(experss.json())
app.use(experss.urlencoded({ extended: false })) 

const openDb=()=>{
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'admin',
        port: 5432,
    })
    return pool
}

app.get('/', (req, res) => {
    const pool = openDb()

    pool.query('SELECT * FROM task',(err, result) => {  
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.status(200).json(result.rows)
})
})

app.listen(port, () => {
    console.log(`Server running on http://localhost ${port}`)
})

app.post('/create', (req, res) => {
    const pool = openDb()
    const {task} = req.body

    if(!task) {
        return res.status(400).json({error: 'Task is required'})
    }

    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [task.description],
    (err, result) => {
        if(err) {
            return res.status(500).json({error: err.message})
        }
        res.status(201).json({id: result.rows[0].id, description: task.description })
    })
})


app.delete('/delete/:id', (req, res) => {
    const pool = openDb()
    const {id} = req.params


    console.log('Deleting task with id: ${id}')
    pool.query('DELETE FROM task WHERE id = $1',
    [id], (err, result) => {
    if (err) {
    return res.status(500).json({ error: err.message })
    }
    if(result.rowCount === 0) {
    return res.status(404).json({ error: 'Task not found' })
    }
    return res.status(200).json({id:id})
    })
})
