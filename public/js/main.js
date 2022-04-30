const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from the query in the URL
const params = (new URL(document.location)).searchParams;
const username = params.get('username');
const room = params.get('room');

// Emit username and room to server
socket.emit('joinRoom', ({username,room}));

// Get room and user info
socket.on('roomUsers', ({room,users})=>{
     outputRoom(room);
     outputUsers(users)
})

// Message from server 
socket.on('message',message=>{
     console.log(message)
     outputMessage(message);

     // Scroll to new message
     chatMessages.scrollTop = chatMessages.scrollHeight; 
})

// Message Submit
chatForm.addEventListener('submit',(e)=>{
     e.preventDefault();

     // Get message text from DOM
     const msg = e.target.elements.msg.value;

     //Emit message 
     socket.emit('chatMessage', msg);

     //Clear message box and set focus
     e.target.elements.msg.value='';
     e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage=(message)=>{
     const div = document.createElement('div');
     div.classList.add('message');
     div.innerHTML = `<p class="meta">${message.username}  <span>${message.time}</span></p>
     <p class="text">
          ${message.msg}
     </p>`;
     chatMessages.appendChild(div);
}

// Output room name to DOM
const outputRoom=(room)=>{
     roomName.innerText = room
}

// Output current users to DOM
const outputUsers = (users)=>{
     userList.innerHTML =`
          ${users.map(user=>`<li>${user.username}</li>`).join('')}
     `
}