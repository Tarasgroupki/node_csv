const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { secretJwtKey } = require('../../config');

module.exports = {
  main() {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];

        req.userData = jwt.verify(token, secretJwtKey);
        // - user checking
        // req.userIsset = await User.findOne({ _id: req.userData.userId });
        if (req.userData.type === 'user') {
          return next();
        }
        return res.status(401).json({
          message: 'Auth failed',
        });
      } catch (error) {
        return res.status(401).json({
          message: 'Auth failed',
          error,
        });
      }
    };
  },
};
