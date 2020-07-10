const   {Todo}      =   require("../../models/todo"),
        {User}      =   require("../../models/user"),

        {ObjectId}  =   require("mongodb"),
        jwt         =   require("jsonwebtoken");



const todos =[{
    _id:new ObjectId(),
    text:"1st thing todo"
},{
    _id:new ObjectId(),
    text:"2nd thing todo",
    completed:true,
    completedAt:6969
}];


let populateTodos = (done)=>{
        Todo.deleteMany({})
        .then(()=>{
            Todo.insertMany(todos)
            .then(()=>done());
        });
}

const userOneId=new ObjectId();
const userTwoId=new ObjectId();
const userThreeId=new ObjectId();

const users=[
    {
        _id:userOneId,
        email:"user1@somemail.com",
        password:"user1pw",
        tokens:[{
            access:"auth",
            token:jwt.sign({_id:userOneId,access:"auth"},"secret").toString()
        }]
    },
    {
        _id:userTwoId,
        email:"user2@somemail.com",
        password:"user2pw"
    },
    {
        _id:userThreeId,
        email:"user3@somemail.com",
        password:"user3pw",
        tokens:[{
            access:"auth",
            token:jwt.sign({_id:userOneId,access:"auth"},"secret").toString()
        }]
    }
]


let populateUsers=(done)=>{
    User.remove({})
    .then(()=>{
        userOne=new User(users[0]).save();
        userTwo=new User(users[1]).save();

        return Promise.all([userOne,userTwo])
    })
    .then(()=>done());

}

module.exports={todos,populateTodos,users,populateUsers};
