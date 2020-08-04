//Modules
const path =require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const morgan =require("morgan");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp =require('hpp');

const AppError =require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const { ppid } = require('process');
const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters.js');
const { Console } = require('console');
const reviewRoutes =require('./routes/reviewRouters');
const router = require('./routes/reviewRouters');
const viewRouter = require('./routes/viewRouters');
const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');

//set pug file
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global Middleware 
// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));


app.use(helmet());

//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}
app.use(express.json());

const limiter =rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'To many request from this IP, please try again in an hour!'
});
app.use('/api',limiter);

//body parser, reading data from body into req.body
app.use(express.json({limit : '10kb'}));
app.use(express.urlencoded({ extended:true, limit: '10kb' }));
app.use(cookieParser());

//data Sanitiation
app.use(mongoSanitize());

//agains xss
app.use(xss());

// preventing parameter polution
app.use(hpp({
    whitelist:[
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'price'
    ]
}
));

// app.use((req,res,next) => {
//     console.log("hello from the middleware");
//     next();
// });
app.use((req,res,next) => {
    req.requestTime = new Date().toDateString();
    //console.log(req.cookies);
    next(); 
});
//app.use(express.static(`${__dirname}/public`))
/*app.get('/', (req,res)=>{
    res.status(200).json({message: 'Hello from the server', api: 'Natours'});
});

app.post('/', (req,res)=>{
    res.status(200).send('You can post to these side');
})
*/
//Route Handler



//Routes
//app.get('/api/v1/tours/:id',getTour); 
//app.get('/api/v1/tours',getAllTours);
//app.post('/api/v1/tours',createTour);
//app.delete('/api/v1/tours/:id',deleteTour);

app.use('/',viewRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/reviews',reviewRoutes);
app.use('/api/v1/bookings',bookingRouter);

app.all('*',(req,res,next) =>{
    
    // res.status(404).json({
    //     status:'fail',
    //     message:`Cant find the ${req.originalUrl} on this server`
    // });

    // const err = new Error(`Cant find the ${req.originalUrl} on this server`);
    // err.status ='fail';
    // err.statusCode =404;

    next(new AppError(`Cant find the ${req.originalUrl} on this server`));
}); 

app.use(globalErrorHandler);

//START SERVER
module.exports = app;