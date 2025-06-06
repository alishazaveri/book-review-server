const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const token = req.cookies.accessToken;

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (user && user.emailId) {
      req.user = user;

      return next();
    }
  } catch (e) {
    console.log(e);
    return res
      .status(403)
      .send({ body: { message: "Your are not authorized" } });
  }

  return await res.formatResponse({
    contentType: "application/json",
    statusCode: 403,
    body: { message: "You are not authorized" },
  });
};
