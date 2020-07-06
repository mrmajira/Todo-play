const   {mongoose}  = require ("../server/db/mongoose"),
        {Todo}      = require ("../server/models/todo"),
        {User}      = require ("../server/models/user"),
        {ObjectId}  = require ("mongodb")  ;


// Todo.remove({})
// .then((res)=>{
//     console.log(res);
// },(err)=>{
//     console.log("-Err in removing: ");
//     console.log(err);
// });

// Todo.findOneAndRemove({_id:"5f036ace243ceb564a06e009"})
// .then((doc)=>{
//     console.log("-- document found and deleted: \n",doc);
    
// })
// .catch();

Todo.findByIdAndRemove("5f036abd243ceb564a06dffa")
.then((doc)=>{
    console.log("deleted document: \n",doc);
    
});







