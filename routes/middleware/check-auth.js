const jwt = require('jsonwebtoken');
const { secretJwtKey } = require('../../config');

module.exports = {
  main() {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];

        req.userData = jwt.verify(token, secretJwtKey);
        // - user checking
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
