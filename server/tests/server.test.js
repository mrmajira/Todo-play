const expect    = require("expect"),
      request   = require("supertest");
      
const {app} = require("./../server");      
const {Todo} = require("./../models/todo");      

const todos =[{
    text:"1st thing todo"
},{
    text:"2nd thing todo"
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
            console.log("--------im new res body: "
            // // +JSON.stringify(JSON.parse(res.text).text,undefined,2)
            +JSON.stringify(res.body.text,undefined,2)
            // // +res.req
            );
            
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
            expect(res.body.docs.length).toBe(2);
        })
        .end(done);
    });
});

// ===============================================================

// const expect = require('expect');
// const request = require('supertest');

// const {app} = require('./../server');
// const {Todo} = require('./../models/todo');

// const todos = [{
//   text: 'First test todo'
// }, {
//   text: 'Second test todo'
// }];

// beforeEach((done) => {
//   Todo.remove({}).then(() => {
//     return Todo.insertMany(todos);
//   }).then(() => done());
// });

// describe('POST /todos', () => {
//   it('should create a new todo', (done) => {  
//     var text = 'Test todo text';

//     request(app)
//       .post('/todos')
//       .send({text})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.text).toBe(text);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.find({text}).then((todos) => {
//           expect(todos.length).toBe(1);
//           expect(todos[0].text).toBe(text);
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should not create todo with invalid body data', (done) => {
//     request(app)
//       .post('/todos')
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.find().then((todos) => {
//           expect(todos.length).toBe(2);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });

// describe('GET /todos', () => {
//   it('should get all todos', (done) => {
//     request(app)
//       .get('/todos')
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todos.length).toBe(2);
//       })
//       .end(done);
//   });
// });





