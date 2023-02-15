const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());

// if (process.env.NODE_ENV === 'development') {
//   console.log('This is development environment');
// }

app.use((req, res, next) => {
  console.log('Hello from the middleware. 😉');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Router Middleware
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server!`,
  // });
  //or
  // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
  //or
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// app.use((err, req, res, next) => {
//   console.log(err.stack);
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

module.exports = app;
