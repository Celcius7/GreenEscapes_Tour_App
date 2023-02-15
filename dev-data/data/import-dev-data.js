require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');

const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.set('strictQuery', false);
mongoose.connect(DB).then(() => {
  console.log('DB connection sucessful.');
});

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMPORT DATA IN DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data sucessfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Sucessfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
