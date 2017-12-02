const express = require('express'),
      Storage = require('../Storage'),
      Router = express.Router()

Router.get('/users',function(req, res){
  //get Usuarios
  Storage.getData('users')
         .then(function (users){
           res.json(users)
         }).catch(function(error){
           res.sendStatus(500).json(error)
         })
})
Router.get('/messages',function(req, res){
  //get Messages
  Storage.getData('messages')
         .then(function (messages){
           res.json(messages)
         }).catch(function(error){
           res.sendStatus(500).json(error)
         })
})
Router.post('/users', (req, res) => {
  //post Usuarios
  let user = req.body.users
  Storage.getData('users')
         .then((users) =>{
           return new Promise((resolve, reject) =>{
             Storage.saveData('users',user,users)
                    .then( (message) =>{
                      resolve(message)
                    }).catch((err) =>{
                      reject(err)
                    })
           })
         }).then((message) => {
           res.json(message)
         }).catch((err)  => {
           res.sendStatus(500).json(err)
         })
})
Router.post('/messages',(req, res) =>{
  //post Messages
  let message = req.body.message
  Storage.getData('messages')
         .then((message) =>{
           return new Promise((resolve, reject) =>{
             Storage.saveData('users',message,messages)
                    .then((message) =>{
                      resolve(message)
                    }).catch((err) =>{
                      reject(err)
                    })
           })
         }).then((message) =>{
           res.json(message)
         }).catch((err) =>{
           res.sendStatus(500).json(err)
         })
})

module.exports = Router

(function(document, window, undefined,$,io){
  function (){
    return Chat = {
      //todo el codigo
      apiUrl: '/chat',
      $userDataModal: $('#modalCaptura'),
      $btnMessages: $('#btnMessage'),
      $messageText: $('messageText'),
      $userName: '',
      socket = io(),


      Init:function(){
        var self = this
        this.fetchUserInfo(function (user){
          self.renderUser(user)
        })
        this.watchMessages()
        self.socket.on('userJoin',function(users){
            self.renderUser(user)
        })
        self.socket('message',function(message){
          self.renderMessage(message)
        })


      },
      fetchUserInfo: function(callback){
        var self = this
        this.$userDataModal.openModal()
        var $Guardainfo = $('.guardainfo')
        $Guardainfo.on('click',function(){
          var nombre = $('nombreUsuario').val()
          var user = [{nombre: nombre, img: 'p2.png'}]
          self.socket.emit('userJoin',user[0])
          callback(user)

          self.joinUser(user[0])
          self.userName = nombre
          self.$userDataModal.closeModal()
        })

        self.getInitialusers()
      },
      getInitialusers: function(){
        var self = this
        var endpoint = self.apiUrl + '/users'
        self.ajaxRequest(endpoint,'GET',{})
          .done(function (data){
            var users = data.current
            self.renderUser(users)
          }).fail(function (err){
            console.log(err)
          })
      },
      ajaxRequest: function (url, type, data){
        return $ajax({
          url: url,
          type: type,
          data: data
        })
      },
      joinUser: function(user){
          var self =  this
          var endpoint = self.apiURl + '/users'
          var userObj = {user: user}
          self.ajaxRequest(endpoint, 'POST', userObj)
          .done(function (confirm){
            console.log(confirm)
          }).fail(function (error){
            alert (error)
          })
      },
      renderUser: function (users){
        var self = this
        var userList = $('.users-list')
        var userTemplate = '<li class="collection-item avatar">'+
                            '<img src="image/:image:" class="circle"'+
                            '<span class="title">:nombre:<span>' +
                            '<p><img src="image/online.png"/> En linea </p>'+
                            '</li>'

                            users.map(function (user){
                              var newUser = userTemplate.replace(':image:', 'p2.jpg')
                                                        .replace(':nombre:',user.nombre)
                            })
      },
      watchMessages: function(){
        var self = this
        self.$messageText.on('keypress',function(e){
          if(e.which == 13){
            if($(this).val().trim()!='')
            var message = {
              sender: self.userName,
              text: $(this).val()
            }
            self.renderMessage(message)
            self.socket.emit('message',message)
            $(this).val('')
          }else{
            e.preventDefault()
          }
        })
        self.$btnMessages.on('click',function (){
          if(self.$messageText.val()!=''){
            var message = {
              sender: self.userName,
              text: $(this).val()
            }
            self.renderMessage(message)
            self.socket.emit('message',message)
            self.$messageText.val('')
          }
        })
      },
      renderMessage: function (message){
        var self = this
        var tipoMensaje = message.sender == sender.userName ? 'recibidos':'enviados'
        var messageList = $('.historial-chat')
        var messageTemplate = '<div class=":tipoMensaje:">'+
                                '<div class="mensaje">'+
                                  '<div class="imagen">'+
                                    '<img src="image/p2.jpg" alt="contacto"/>'+
                                  '</div>' +
                                  '<div class="texto">' +
                                  '<span class="nombre">:nombre:</span><br>'+
                                  '<span>:mensaje:</span>'+
                                '</div>'+
                                '<div class="hora">'+
                                  '<span class="numHora">:hora:</span>'+
                                '</div>'+
                                '</div>'+
                                '</div>';
      var currenDate = new Date()
      var newMessage = messageTemplate.replace(':tipoMensaje:',tipoMensaje)
                                      .replace(':nombre:',message.sender)
                                      .replace(':mensaje:', message.text)
                                      .replace(':hora:', currenDate.getHours() + : currenDate.getMinutes())
      messageList.append(newMessage)
      $('.scroller-chat').animate({ scrollTop = $(".scroller-char").get(0).scrollHeight },500)

      }


    }
  }()
  Chat.init()
})(document, window, undefined, jQuery,io)
