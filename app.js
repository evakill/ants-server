var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var orgsRouter = require('./routes/orgs')
var authRouter = require('./routes/auth')
var postsRouter = require('./routes/posts')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://jpesce:ants@cluster0.dhz01.mongodb.net/ants?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/orgs', orgsRouter)
app.use('/posts', postsRouter)
app.use('/auth', authRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // send an error
  res.status(err.status || 500)
  res.send({ err })
})

module.exports = app
