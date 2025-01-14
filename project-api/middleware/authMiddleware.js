  const jwt = require('jsonwebtoken');

  const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token');
      return res.status(401).json({ message: 'Not authorized' });

    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      //console.log('User:', req.user);
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token not valid' });
    }
  };

  module.exports = protect;
