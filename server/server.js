const   express     =   require("express"),
        bodyParser  =   require("body-parser");

const {mongoose}=require("./db/mongoose");
const {User} = require("./models/user");
const {Todo} = require("./models/todo");


const port = 3000;
let app=express();

app.use(bodyParser.json());

app.post("/todos",(req,res)=>{

    console.log(req.body);
    let todo = new Todo({
        text:req.body.text
    });
    todo.save()
    .then((doc)=>{
        console.log("--Successfully saved todo: \n",doc);
        res.send("--Successfully saved todo: \n"+doc);
    },(err)=>{
        console.log("--Err in saving todo: \n",err);  
        res.status(400).send(err);  
    });
});



app.listen(port,()=>{
    console.log(`Server listening on port: ${port}`);
});
