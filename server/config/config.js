let     env       =   process.env.NODE_ENV || 'development';
const   mLabURI   ="mongodb+srv://mrmr:24843924@cluster0-smfdh.mongodb.net/NODE_JS_ANDREW?retryWrites=true&w=majority";

if(env==='development'){
    process.env.port=3000;
    process.env.MONGODB_URI="mongodb://localhost:27017/TodoApp";
}else if(env==='test'){
    process.env.port=3000;
    process.env.MONGODB_URI="mongodb://localhost:27017/TodoAppTest";
}else if(env==='production'){
    process.env.MONGODB_URI=mLabURI; 
}
