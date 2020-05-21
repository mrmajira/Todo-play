const {MongoClient,ObjectID} = require("mongodb");


MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        console.log("Unable to conect to mongodb server");
        return console.log(err);
    }
    console.log("Connected to mongodb server");
    const db=client.db("TodoApp");



//d thing +++++++++++++
//  {
//     text:"do watchu goda do",
//     completed:false
// }

    // delete many ==================================
    // db.collection("Todos").deleteMany({
    //     text:"do watchu goda do"
    // })
    // .then((result)=>{
    //     console.log(`Successfullt deleted :`);
    //     console.log(result);
        
    // })
    // .catch((err)=>{
    //     console.log("--Unable to delete many",err);  
    // });
    // delete one ====================================
    // db.collection("Todos").deleteOne({text:"do watchu goda do"})
    // .then((res)=>{
    //     console.log(res);     
    // });
    // find one and delete ==================================
    // db.collection("Todos").findOneAndDelete({ text:"do watchu goda do"})
    // .then((del)=>{
    //     console.log("--Successfully deleted:");
    //     console.log(del.value);
    // });
    // chalnge ==============
    // db.collection("Users").deleteMany({name:"person1"})
    // .then((res)=>{
    //     console.log(`--Successfully deleted all: ${res}`);
        
    // });
    // db.collection("Users").findOneAndDelete({
    //     _id:new ObjectID("5ec6684742245eb7d05def92")})
    // .then((res)=>{
    //     console.log(`--Successfully found and deleted one:`);
    //     console.log(res.value);
    // });
    

    client.close();
});
