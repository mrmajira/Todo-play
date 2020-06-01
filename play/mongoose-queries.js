const   {mongoose}  = require ("../server/db/mongoose"),
        {Todo}      = require ("../server/models/todo"),
        {User}      = require ("../server/models/user"),
        {ObjectId}  = require ("mongodb")  ;


let id = "7ed4cf6f1399d2770829ff8aLOL";
// let id = "5ed4cf6f1399d2770829ff8a";
let valId=ObjectId.isValid(id);

// Todo.find({
//     _id:id
// })
// .then((todos)=>{
//     console.log("Todos : ",todos);
// });


// Todo.findOne({
//     _id:id
// })
// .then((todo)=>{
//     console.log("todo : ",todo);
// });

// Todo.findById(id)
// .then((todo)=>{
//     if(!todo)
//     {
//         return console.log("todo not found");
//     }
//     return console.log("Found by id: \n",todo);


// })
// .catch((err)=>{
//     console.log("--Err in finding by id");
//     if(!valId){
//         return console.log("todo id not valid format");
//     }
//     return console.log(err);
// });


// let userId = "lol5ecbbc7d0d33a414053e289b";
let userId = "5ecbbc7d0d33a414053e289b";
let userIdValid=ObjectId.isValid(userId);
User.findById(userId)
.then((user)=>{
    if(!user){
        return console.log("user not found");
    }
    return console.log("user found by id: \n",user);
})
.catch((err)=>{
    console.log("--Err in finding user by id");
    if(!userIdValid){
        return console.log("user id format not valid");
    }
    return console.log(err);
});








