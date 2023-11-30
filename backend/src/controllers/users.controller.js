import User from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    const userFound = await User.findOne({ username });
    console.log('User Found:', userFound);

    if (userFound) {
      const error = new Error("The user already exists");
      error.status = 409;
      throw error;
    }

    const newUser = new User({ username });
    
    const userSaved = await newUser.save();
    console.log('User created successfully:', userSaved);

    return res.json(userSaved);
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);

    if (!userDeleted) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
