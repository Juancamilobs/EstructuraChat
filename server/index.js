const bodyParser = require('body-parser')
  http         = require('http')
  express      = require('express')
  chat = require('./Chat')
  socketio = require('socket.io')

const port       = port = process.env.PORT || 3000,
    app        = express(),
    Server     = http.createServer(app),
    io = socketio(Server)


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/chat',chat)
app.use(express.static('public'))

Server.listen( PORT, () => console.log('server is running on port: '+ PORT))

io.on('Connection', function(socket){
  console.log('new user connected, socket: '+ socket.id)

  socket.on('userJoin', user => {
  //escuchar el evento user join, para agregar un usario y emitirlo a los otros sockets
  socket.user = user
  socket.broadcast.emit('userJoin', user)
  })


  socket.on('message', message => {
    //escuchar el evento message, para mandarlo a los otros sockets
    socket.broadcast.emit('message', message)
  })

  socket.on('disconnect',() =>{
    //escuchar el evento disconnect para eliminar el usuario
    if(socket.hasOwnProperty('user')){
      deleteUser(socket.user, err,confirm => {
        if(err) throw err
      })
    }
  })
})
