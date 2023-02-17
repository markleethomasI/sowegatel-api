const mongoose = require('mongoose')

// Connect Db
mongoose.connect(process.env.MONGODB_STRING, {
   
})

const express = require('express')

const app = express()
const routes = require('./routes')

app.use(express.json())

app.use(routes)

app.listen(process.env.PORT, () => {
    console.log('Express app started on port ' + process.env.PORT)
})

