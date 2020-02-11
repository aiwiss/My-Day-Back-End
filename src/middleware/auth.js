const expressJwt = require('express-jwt');
const secret = process.env.JWT_SECRET;

module.exports = auth;

function auth(userRoles) {
  const roles = typeof userRoles === 'string' ? [userRoles] : userRoles;
  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // authentication and authorization successful
      next();
    }
  ];
}