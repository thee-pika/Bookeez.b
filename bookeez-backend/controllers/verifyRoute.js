import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // const token = req.headers['authorization'];
  const token = req.headers['authorization']?.split(' ')[1]; // Extracts the token

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("er",err);
      return res.status(401).json({ message: 'Failed to authenticate token :)' });
    }   
    console.log("Token decoded:", decoded);
    req.userId = decoded.id;
    next();
  });
};

export default verifyToken;