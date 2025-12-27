// // const jwt = require("jsonwebtoken");
// // const User = require("../models/user");

// // const protect = async (req, res, next) => {
// //   let token;

// //   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
// //     try {
// //       token = req.headers.authorization.split(" ")[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = await User.findById(decoded.id).select("-password");
// //       return next();
// //     } catch (error) {
// //       return res.status(401).json({ message: "Not authorized, token failed" });
// //     }
// //   }

// //   return res.status(401).json({ message: "Not authorized, no token" });
// // };

// // module.exports = { protect };
// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// const auth = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");
//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       return next();
//     } catch (err) {
//       return res.status(401).json({ message: "Token invalid" });
//     }
//   }

//   return res.status(401).json({ message: "No token provided" });
// };

// module.exports = auth;
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Token failed" });
    }
  }

  return res.status(401).json({ message: "No token" });
};

module.exports = { protect };
