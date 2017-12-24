//LADO CLIENTE

// io=libreria sockets.io de parte del cliente
//connect = método para que se conecte a un servidor de sockets que en este caso es node
 // que esta corriendo en el localhost 3000

 function addUsername() {
     var txt;
     var person = prompt("Bitte benutzername eingeben", "Harry Potter");
     if (person == null || person == "") {
         txt = "User cancelled the prompt.";
     } else {
         txt = "Hello " + person + "! How are you today?";
     }

     return person;

 }

 function addChat() {
     var txt;
     var person = prompt("In welcher Chat?", "General");
     if (person == null || person == "") {
         txt = "User cancelled the prompt.";
     } else {
         txt = "Hello " + person + "! How are you today?";
     }

     return person;

 }




var socket = io.connect('http://localhost:3000/chatmessage',{'forceNew': true});

socket.emit("connect-chat", { owner: addUsername(), participant: addChat()});




//cuando reciba el evento 'message' imprima los datos del servidor
socket.on('new-message', function(data){
  console.log(data);
  render(data);
})


socket.on('status', function(data){
  console.log(data);
});

function render(data){
/*
  var html = data.map(function(elem, index){
    return(
       `<div>
          <strong>${elem.message}</strong>;
          </div>`);
  }).join(" ")
*/
  document.getElementById('messages').innerHTML = data.data.message;
}

function addMessage(e){
  var payload = {
    username: document.getElementById('username').value,
    channelname: 'General',
    message: document.getElementById('text').value
  };

// el cliente emite el evento 'new-message' y le pasa como dato el payload y se debe escuchar en el servidor
  socket.emit('new-message', payload)
    return false
}
