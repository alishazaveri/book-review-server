const usersDb = require("../db/user.db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

async function createUser(req, res) {
  try {
    const { username, password, emailId } = req.body;

    validate({ username, password, emailId });

    const user = await usersDb.getUserByEmailId({ emailId });

    if (user && user._id) {
      return res
        .status(400)
        .send({ body: { message: "User with this emailId already exist" } });
    } else {
      const salt = await bcrypt.genSalt(+process.env.HASH_SALT || 10);

      const hashedPassword = await bcrypt.hash(password, salt);

      if (hashedPassword) {
        const user = await usersDb.createUser({
          username,
          password: hashedPassword,
          emailId,
        });

        await user.save();

        user.password = "";

        const token = jwt.sign(
          { _id: user._id, emailId: user.emailId },
          process.env.JWT_SECRET_KEY || ""
        );

        res.cookie("accessToken", token);

        return res.status(200).send({ data: user });
      } else {
        throw new Error("Something went wrong");
      }
    }
  } catch (error) {
    console.log("Login User Error = ", error);

    return res.status(500).send({ error: error.message });
  }

  function validate({ username, password, emailId }) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      emailId: Joi.string().required(),
    });

    const { error } = schema.validate({ username, password, emailId });

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function loginUser(req, res) {
  try {
    const { emailId, password } = req.body;

    validate({ emailId, password });

    const user = await usersDb.getUserByEmailId({ emailId });

    if (!user || !user._id) {
      return res
        .status(400)
        .send({ body: { message: "User with this emailId does not exist" } });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ body: { message: "Invalid password" } });
    }

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId },
      process.env.JWT_SECRET_KEY || ""
    );

    res.cookie("accessToken", token);

    return res.status(200).send({ data: token });
  } catch (error) {
    console.log("Login User Error = ", error);
    return res.status(500).send({ error: error.message });
  }

  function validate({ emailId, password }) {
    const schema = Joi.object({
      emailId: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ emailId, password });

    if (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = {
  createUser,
  loginUser,
};
