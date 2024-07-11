const Joi = require("joi");
const bcrypt = require("bcrypt");

const prisma = require("../helpers/connection");
const {createToken} = require("../helpers/jwt")

const registerController = async (req, res) => {
    try {
      const { fullname, username, password, age } = req.body;
  
      const schema = Joi.object({
        fullname: Joi.string().min(5).required(),
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        age: Joi.number(),
      });
  
      const { error } = schema.validate({ fullname, username, password, age });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const existingUser = await prisma.users.findUnique({ where: { username } });
      if (existingUser) {
        return res.status(409).json({ message: "This username is already taken!" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const newUser = await prisma.users.create({
        data: {
          fullname,
          username,
          password: hashedPassword,
          age,
        },
      });
  
      const token = createToken({ id: newUser.id });
  
      res.json({ message: "Registration successful!", token });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const loginController = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const schema = Joi.object({
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
      });
  
      const { error } = schema.validate({ username, password });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      };
  
      const existingUser = await prisma.users.findUnique({where: {username}})
      if (!existingUser) {
        return res.status(409).json({ message: "Username or password incorrect!!!" });
      };
  
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect username or password!!!" });
      };

      const token = createToken({ id: existingUser.id });
  
      res.json({ message: "Login successful!!!", data: token });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!!" });
    }
  };

module.exports = {
    registerController,
    loginController
};