import experss from 'express'
import cors from 'cors'
import todoRouter from './routes/todoRouter.js'

const port = process.env.PORT

const app = experss()
app.use(cors())
app.use(experss.json())
app.use(experss.urlencoded({ extended: false }))
app.use('/', todoRouter)

app.listen(port)

app.use((err,req, res,next) => {
const statusCode = err.status || 500
res.status(statusCode).json({
    error: {
        message: err.message,
        status: statusCode
    }
})
})
