const   express     =   require("express"),
        bodyParser  =   require("body-parser");

const   {mongoose}=     require("./db/mongoose"),
        {ObjectId}=     require("mongodb"),
        {User}    =     require("./models/user"),
        {Todo}    =     require("./models/todo");


let app=express();
const port = 3000 || process.env.PORT ;

app.use(bodyParser.json());

app.post("/todos",(req,res)=>{

    // console.log(req.body);
    let todo = new Todo({
        text:req.body.text
    });
    todo.save()
    .then((doc)=>{
        // console.log("--Successfully saved todo: \n",doc);
        // res.send("--Successfully saved todo: \n"+doc);
        res.send(doc);
    },(err)=>{
        // console.log("--Err in saving todo: \n",err);  
        res.status(400).send(err);  
    });
});


app.get("/todos",(req,res)=>{
    Todo.find()
    .then((todos)=>{
        // console.log(docs);
        // res.send(docs);
        
        // console.log("--Successfully found todos: \n",docs);
        res.send({todos});
    },(err)=>{
        // console.log("--Err in finding todos: \n",err);  
        res.status(400).send(err)
    });
});



app.get("/todos/:id",(req,res)=>{
    // console.log(req.params);
    // res.send(req.params);
    // ===================
    let id = req.params.id;
    let validId = ObjectId.isValid(id);
    if(!validId){
        // console.log("todo id not valid");
        return res.status(404).send("todo id not valid");
    }
    Todo.findById(id)
    .then((todo)=>{
        if(!todo){
            // console.log("todo not found ");
            return res.status(404).send({todo:[]});
        }
        // console.log("todo found by id: \n",todo);
        res.status(200).send({todo});
    })
    .catch((err)=>{
        
        console.log("--Err in finding todo by id: \n",err);
        res.status(400).send("--Err in finding todo by id: \n"+err);
    });

});



app.listen(port,()=>{
    console.log(`Server listening on port: ${port}`);
});


module.exports={app};
