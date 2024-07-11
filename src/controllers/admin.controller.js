const bcrypt = require("bcrypt");
const Joi = require("joi");

const prisma = require("../helpers/connection")
const { createTokenAdmin } = require("../helpers/jwt");

const registerAdmin = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;

    const schema = Joi.object({
      fullname: Joi.string().min(5).required(),
      username: Joi.string().min(5).required(),
      password: Joi.string().min(5).required()
    });

    const { error } = schema.validate({ fullname, username, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const existingAdmin = await prisma.admins.findUnique({ where: { username } });
      if (existingAdmin) {
        return res.status(409).json({ message: "This username is already taken!" });
      }

    const hashPass = await bcrypt.hash(password, 12);

    const newAdmin = await prisma.admins.create({ data: {
      fullname,
      username,
      password: hashPass 
    }
    }); 

    const token = createTokenAdmin({ id: newAdmin.id }); 

    res.json({ message: "Admin registered successfully!!!", data: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!!!" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const schema = Joi.object({
      username: Joi.string().min(5).required(),
      password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate({ username, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingAdmin = await prisma.admins.findUnique({ where: { username } });
      if (!existingAdmin) {
        return res.status(409).json({ message: "Incorrect username or password!!!" });
      }

    const passwordMatch = await bcrypt.compare(password, existingAdmin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect username or password!!!" });
    }

    const token = createTokenAdmin({ id: existingAdmin.id });

    res.json({ message: "Login successful!!!", data: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!!!" });
  }
};

const getAdmin = async (req, res) => {
    try {
        const admins = await prisma.admins.findMany()

        res.json({ massage: "Success", data: admins });
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!!!"})
    }
};


const getAllUsers = async(req, res) => {
  try {
    const allUsers = await prisma.users.count();

    res.json({message: "Success", data: allUsers});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!!!" });
  }
}

module.exports = { 
    registerAdmin,
    loginAdmin, 
    getAdmin,
    getAllUsers
};