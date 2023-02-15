const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const userController = {
  getAllUser: catchAsync(async (req, res, next) => {
    const users = await User.find();
    res
      .status(200)
      .json({ status: 'sucess', results: users.length, data: { users } });
  }),

  createUser: (req, res) => {
    res
      .status(500)
      .json({ status: 'error', message: 'This route is not yet defined.' });
  },

  getUser: (req, res) => {
    res
      .status(500)
      .json({ status: 'error', message: 'This route is not yet defined.' });
  },

  updateUser: (req, res) => {
    res
      .status(500)
      .json({ status: 'error', message: 'This route is not yet defined.' });
  },

  deleteUser: (req, res) => {
    res
      .status(500)
      .json({ status: 'error', message: 'This route is not yet defined.' });
  },
};

module.exports = userController;
