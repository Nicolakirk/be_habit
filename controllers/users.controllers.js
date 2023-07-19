
const { fetchUsers, insertUsers, fetchUserByUser } = require("../models/users.model");

exports.getUsers = (req, res) =>{
    fetchUsers().then((output)=>{
        res.status(200).send({ users: output });
    })
    .catch((err)=>{
        next( err);
    })
};


exports.postUsers = (req, res, next)=>{
    
    const  ownerInput =  req.body;
    console.log(ownerInput)

const usersPromises = [insertUsers( ownerInput)];
Promise.all(usersPromises)
.then (([users])=>{
   console.log(users)
    res.status(201).send({ users })
})
.catch((err)=>{
    next( err);
  });


}


exports.getUserByUser = (req, res) =>{
 
    const username = req.params;
  
    fetchUserByUser(username).then((output)=>{
        res.status(200).send({ users: output });
    })
    .catch((err)=>{
        next( err);
    })
  };