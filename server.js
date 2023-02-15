// require('dotenv').config();
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!🤔 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const mongoose = require('mongoose');

// console.log(app.get('env'));
// console.log(process.env);

app.get('/', (req, res) => {
  res.send('<h1>Server is up and running</h1>');
});

const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.set('strictQuery', false);
mongoose.connect(DB).then(() => {
  console.log('DB connection sucessful.');
});

console.log(process.env.PORT);
const PORT = process.env.PORT || 8080;
const server = app.listen(`${PORT}`, () => {
  console.log(`Server is up and runnig at port : ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!🤔 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
