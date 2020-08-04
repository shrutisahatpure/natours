const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err =>{
    console.log('UNCAUGHT EXEPTION...Shutting Down!')
    console.log(err.name, err.message);
    process.exit(1);
});
const app = require('./app.js');

//console.log(app.get('env'));
dotenv.config({path : './config.env'});
//console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD).toString();
mongoose
//.connect(process.env.DATABASE_LOCAL,{
.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})  
.then(() => console.log('Db connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{  
    console.log(`Listening to port ${port} ......` );
});

process.on('unhandledRejection', err =>{
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION...Shutting Down!')
    server.close(() =>{
        process.exit(1);
    });
});

//console.log(x);
//shruti