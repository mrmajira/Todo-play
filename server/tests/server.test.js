const expect    = require("expect"),
      request   = require("supertest"),
      {ObjectId}= require("mongodb");

const {app} = require("./../server");      
const {Todo} = require("./../models/todo");      


// --- Seed
const todos =[{
    _id:new ObjectId(),
    text:"1st thing todo"
},{
    _id:new ObjectId(),
    text:"2nd thing todo",
    completed:true,
    completedAt:6969
}];


// beforeEach((done)=>{
//     Todo.deleteMany({})
//     .then(()=>done());
// });


beforeEach((done)=>{
    Todo.deleteMany({})
    .then(()=>{
        Todo.insertMany(todos)
        .then(()=>done());
    });
});



describe("POST /todos",()=>{
    it("should create a new todo",(done)=>{
        let text="Test todo text";
        request(app)
        .post("/todos")
        .send({text})
        .expect(200)
        .expect((res)=>{
            // console.log("--------im new res body: "
            // // // +JSON.stringify(JSON.parse(res.text).text,undefined,2)
            // +JSON.stringify(res.body.text,undefined,2)
            // // // +res.req
            // );
            
            // expect(JSON.parse(res.text).text).toBe(text);
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.find({text})
            .then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            })
            .catch(err => done(err));
        });    
    });

    it("should not create todo with invalid body data",(done)=>{
        request(app)
        .post("/todos")
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find()
            .then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            })
            .catch(err=>done(err))
        });
    });
});

describe("GET /todos",()=>{
    it("should get all todos",(done)=>{
        request(app)
        .get("/todos")
        .expect(200)
        .expect((res)=>{
            // console.log("----im res in expect: "+
            // JSON.stringify(res.body,undefined,2));
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe("GET /todos/:id",()=>{


    it("should get a todo by a valid id",(done)=>{

            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
                // expect(res.body.todo.length).toBe(1);
            })
            .end(done);
    });

    
    it("shouldn get a todo if no todo in db matched with id",(done )=>{
        request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .expect((res)=>{
            expect(res.body.todo.length).toBe(0);
        })
        .end(done);
    });

    it("shouldnt search for todo if id not valid",(done)=>{
        request(app)
        .get("/todos/lol")
        .expect(404)
        // .expect((res)=>{
        //     console.log(res.body);
            
        //     expect(res.body.err.message).toBe("todo id not valid");
        // })
        .end(done);
    });
});

   

describe("DELETE /todos/:id",()=>{

    it("should remove a todo",(done)=>{
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.delTodo._id).toBe(todos[0]._id.toHexString());
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            hashId=todos[0]._id.toHexString();
            Todo.findById(hashId)
            .then((foundTodo)=>{
                expect(foundTodo).toBeNull();
                done();
            })
            .catch((err)=>done(err));

            // request(app)
            // .get(`/todos/${hashId}`)
            // .expect(404)
            // .expect((res)=>{
            //     expect(res.body.todo._id).toBeUndefined();
            // })
            // .end(done);

        });

    });

    it("should return 404 if todo not found",(done)=>{
        request(app)
        .delete(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it("should return 404 if id not valid",(done)=>{
        request(app)
        .delete(`/todos/lol this is not valid id`)
        .expect(404)
        .end(done);
    });
});



describe("PATCH /todos/:id",()=>{

    it("should update todo text & completed->true",(done)=>{
        hashId=todos[0]._id.toHexString();4
        todo={
            text:"updated - test",
            completed:true
        }

        request(app)
        .patch(`/todos/${hashId}`)
        .send(todo)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe("number");
            expect(res.body.todo.text).toBe("updated - test");
        })
        .end(done);
    //     .end((err,res)=>{
    //         if(err){
    //             return done(err);
    //         }
    //         Todo.findById(hashId)
    //         .then((foundTodo)=>{
    //             expect(foundTodo.completed).toBe(true);
    //             expect(foundTodo.completedAt).toBeA(Number);
    //             expect(foundTodo.text).toBe("updated - test");
    //             done();
    //         })
    //         .catch(()=>done(err));
    //     });

    });

    it("should clear completedAt when todo is not completed",(done)=>{
        hashId=todos[1]._id.toHexString();
        todo={
            completed:false,
            completedAt:"yesterday lol"
        }

        request(app)
        .patch(`/todos/${hashId}`)
        .send(todo)
        .expect(200)
        .end((err,res)=>{
            if(err)return done(err);
            Todo.findById(hashId)
            .then((foundTodo)=>{
                expect(foundTodo.completed).toBeFalsy();
                expect(foundTodo.completedAt).toBeNull();
                done();
            })
            .catch((err)=>{
                done(err)
            });
        });

    });


});








    // });

    // });
    

// });



// =====================================
// it("should get a todo by a valid id",(done)=>{

//     request(app)
//     .get(`/todos/${todos[0]._id.toHexString()}`)
//     .expect(200)
//     .expect((res)=>{
//         expect(res.body.todo.text).toBe(todos[0].text);
//         // expect(res.body.todo.length).toBe(1);
//     })
//     .end(done);
//     )};


// -===================================
