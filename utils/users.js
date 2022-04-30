const users =[];

// Create a user
exports.userJoin =(id,username,room)=>{
     const user = { id,username,room};
     users.push(user);
     return user
};

// Get user details
exports.getCurrentUser = (id)=>{
     return users.find(user => user.id===id)
};

// User leaved chat 
exports.userLeaves = (id)=>{
     const index = users.findIndex(user => user.id === id);
     if(index != -1){
          return users.splice(index,1)[0]
     }
}

// Get all room users
exports.getRoomUsers = (room)=>{
     return users.filter(user => user.room === room);
}